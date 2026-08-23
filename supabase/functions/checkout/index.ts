import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { getCorreoToken, getProvinceCode } from "../_shared/correo-argentino.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface CartItem {
  id: string;
  quantity: number;
}

interface CheckoutRequest {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip: string;
  shipping_country: string;
  payment_method: "paypal" | "mercadopago";
  shipping_type?: string;
  shipping_agency?: string;
  shipping_cost_frontend?: number;
  cart: CartItem[];
  site_url?: string;
}

serve(async (req) => {
  // CORS Preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error("Missing Supabase environment variables.");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    const body: CheckoutRequest = await req.json();

    const {
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      shipping_city,
      shipping_state,
      shipping_zip,
      shipping_country,
      payment_method,
      shipping_type,
      shipping_agency,
      shipping_cost_frontend,
      cart,
      site_url = "https://modesta-editorial.com",
    } = body;

    // Validate fields
    if (
      !customer_name ||
      !customer_email ||
      !customer_phone ||
      !shipping_address ||
      !shipping_city ||
      !shipping_state ||
      !shipping_zip ||
      !shipping_country ||
      !payment_method ||
      !cart ||
      cart.length === 0
    ) {
      return new Response(
        JSON.stringify({ error: "Faltan campos obligatorios en el checkout." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Determine currency and shipping cost
    // Mercado Pago = ARS, PayPal = USD
    const currency = payment_method === "mercadopago" ? "ARS" : "USD";
    const shipping_cost = 0;

    // Get DB books to validate prices and calculate totals securely
    const bookIds = cart.map((item) => item.id);
    const { data: dbBooks, error: booksError } = await supabase
      .from("books")
      .select("*")
      .in("id", bookIds);

    if (booksError || !dbBooks || dbBooks.length !== bookIds.length) {
      return new Response(
        JSON.stringify({ error: "Algunos libros en el carrito no existen en catálogo." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Calculate subtotal
    let subtotal = 0;
    const itemsWithDetails = cart.map((item) => {
      const dbBook = dbBooks.find((b) => b.id === item.id)!;
      const unitPrice = currency === "ARS" ? Number(dbBook.price_ars) : Number(dbBook.price_usd);
      const totalItemPrice = unitPrice * item.quantity;
      subtotal += totalItemPrice;

      return {
        id: dbBook.id,
        title: dbBook.title,
        author: dbBook.author,
        quantity: item.quantity,
        price: unitPrice,
      };
    });

    // For dynamic shipping cost calculation
    let final_shipping_cost = 0;
    
    // shipping_type from frontend is now "S_CP", "D_CP", etc.
    const delivType = shipping_type?.split('_')[0];
    const prodType = shipping_type?.split('_')[1] || 'CP';

    if ((delivType === "D" || delivType === "S") && shipping_country === "AR") {
       try {
           const baseUrl = Deno.env.get("CORREO_API_BASE_URL");
           const customerId = Deno.env.get("CORREO_CUSTOMER_ID");
           const postalOrigin = Deno.env.get("CORREO_POSTAL_ORIGIN") || "A4400";
           const token = await getCorreoToken();
           
           const totalBooks = cart.reduce((acc, item) => acc + item.quantity, 0);
           const totalWeight = totalBooks * 400;

           const ratePayload = {
               customerId,
               postalCodeOrigin: postalOrigin,
               postalCodeDestination: shipping_zip,
               dimensions: { weight: totalWeight, height: 15, width: 20, length: 30 }
           };
           
           const ratesRes = await fetch(`${baseUrl}/rates`, {
               method: "POST",
               headers: {
                   "Authorization": `Bearer ${token}`,
                   "Content-Type": "application/json"
               },
               body: JSON.stringify(ratePayload)
           });
           
           if (ratesRes.ok) {
                const ratesData = await ratesRes.json();
                if (ratesData && ratesData.rates) {
                    const matchedRate = ratesData.rates.find((r: any) => r.deliveredType === delivType && r.productType === prodType);
                    if (matchedRate) {
                        final_shipping_cost = Number(matchedRate.price);
                    } else {
                        throw new Error("Opción de envío no disponible para el destino.");
                    }
                }
            } else {
               throw new Error("No se pudo cotizar el envío con Correo Argentino.");
           }
       } catch (e: any) {
           return new Response(
               JSON.stringify({ error: `Error de envío: ${e.message}` }),
               { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
           );
       }
    }

    // Convert shipping to USD if payment is PayPal
    if (final_shipping_cost > 0 && currency === "USD") {
        try {
            // Fetch dynamic exchange rate from DolarAPI (Oficial or Tarjeta)
            const dolarRes = await fetch("https://dolarapi.com/v1/dolares/oficial");
            if (dolarRes.ok) {
                const dolarData = await dolarRes.json();
                const exchangeRate = dolarData.venta || 1000;
                final_shipping_cost = Number((final_shipping_cost / exchangeRate).toFixed(2));
            } else {
                // Fallback static conversion if API fails
                final_shipping_cost = Number((final_shipping_cost / 1000).toFixed(2));
            }
        } catch (e) {
            final_shipping_cost = Number((final_shipping_cost / 1000).toFixed(2));
        }
    }

    const total_amount = subtotal + final_shipping_cost;

    // Create Order in DB (status pending)
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name,
        customer_email,
        customer_phone,
        shipping_address,
        shipping_city,
        shipping_state,
        shipping_zip,
        shipping_country,
        shipping_cost: final_shipping_cost,
        correo_delivery_type: delivType,
        correo_service: prodType,
        correo_price: final_shipping_cost,
        correo_agency: shipping_agency,
        subtotal,
        total_amount,
        currency,
        payment_method,
        status: "pending",
      })
      .select()
      .single();

    if (orderError || !order) {
      throw new Error(`Error al crear la orden: ${orderError?.message}`);
    }

    // Create Order Items in DB
    const orderItemsToInsert = itemsWithDetails.map((item) => ({
      order_id: order.id,
      book_id: item.id,
      title: item.title,
      quantity: item.quantity,
      price: item.price,
      currency,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItemsToInsert);

    if (itemsError) {
      throw new Error(`Error al registrar los ítems de la orden: ${itemsError.message}`);
    }

    // GATEWAY INTEGRATION
    let redirectUrl = "";
    let gatewayOrderId = "";

    if (payment_method === "mercadopago") {
      const mpToken = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN");
      console.log("MP Token primeros 20 chars:", mpToken?.substring(0, 20));
      if (!mpToken) {
        throw new Error("Mercado Pago Access Token no configurado en el servidor.");
      }

      // Convert items to MP preference format
      const mpItems = itemsWithDetails.map((item) => ({
        id: item.id,
        title: item.title,
        quantity: item.quantity,
        unit_price: item.price,
        currency_id: "ARS",
        category_id: "books",
      }));

      // Add shipping as an item in MP
      mpItems.push({
        id: "shipping",
        title: "Envío " + (shipping_type === "S" ? "a Sucursal" : "a Domicilio"),
        quantity: 1,
        unit_price: final_shipping_cost,
        currency_id: "ARS",
        category_id: "shipping",
      });

      const mpResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${mpToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: mpItems,
          payer: {
            name: customer_name,
            email: customer_email,
            phone: { number: customer_phone },
          },
          back_urls: {
            success: `${site_url}/#checkout/success?gateway=mercadopago&order_id=${order.id}`,
            failure: `${site_url}/#checkout/failure?gateway=mercadopago&order_id=${order.id}`,
            pending: `${site_url}/#checkout/success?gateway=mercadopago&order_id=${order.id}`,
          },
          auto_return: "approved",
          notification_url: `${supabaseUrl}/functions/v1/mercadopago-webhook`,
          external_reference: order.id,
        }),
      });

      if (!mpResponse.ok) {
        const errDetails = await mpResponse.text();
        throw new Error(`Error con API de Mercado Pago: ${errDetails}`);
      }

      const mpData = await mpResponse.json();
      redirectUrl = mpData.init_point;
      gatewayOrderId = mpData.id;

    } else if (payment_method === "paypal") {
      const paypalClientId = Deno.env.get("PAYPAL_CLIENT_ID");
      const paypalSecret = Deno.env.get("PAYPAL_CLIENT_SECRET");
      const paypalMode = Deno.env.get("PAYPAL_MODE") || "sandbox";

      if (!paypalClientId || !paypalSecret) {
        throw new Error("PayPal credentials no configuradas en el servidor.");
      }

      const paypalBaseUrl =
        paypalMode === "live"
          ? "https://api-m.paypal.com"
          : "https://api-m.sandbox.paypal.com";

      // 1. Get Access Token
      const basicAuth = btoa(`${paypalClientId}:${paypalSecret}`);
      const tokenResponse = await fetch(`${paypalBaseUrl}/v1/oauth2/token`, {
        method: "POST",
        headers: {
          "Authorization": `Basic ${basicAuth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      });

      if (!tokenResponse.ok) {
        const errText = await tokenResponse.text();
        throw new Error(`Error de autenticación con PayPal: ${errText}`);
      }

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      // 2. Create Order
      const paypalItems = itemsWithDetails.map((item) => ({
        name: item.title,
        quantity: item.quantity.toString(),
        unit_amount: {
          currency_code: "USD",
          value: item.price.toFixed(2),
        },
        category: "PHYSICAL_GOODS",
      }));

      const paypalResponse = await fetch(`${paypalBaseUrl}/v2/checkout/orders`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              reference_id: order.id,
              amount: {
                currency_code: "USD",
                value: total_amount.toFixed(2),
                breakdown: {
                  item_total: {
                    currency_code: "USD",
                    value: subtotal.toFixed(2),
                  },
                  shipping: {
                    currency_code: "USD",
                    value: final_shipping_cost.toFixed(2),
                  },
                },
              },
              items: paypalItems,
            },
          ],
          application_context: {
            brand_name: "Modesta Editorial",
            locale: "es-ES",
            landing_page: "BILLING",
            user_action: "PAY_NOW",
            return_url: `${site_url}/#checkout/success?gateway=paypal&order_id=${order.id}`,
            cancel_url: `${site_url}/#checkout/failure?gateway=paypal&order_id=${order.id}`,
          },
        }),
      });

      if (!paypalResponse.ok) {
        const errDetails = await paypalResponse.text();
        throw new Error(`Error al crear orden en PayPal: ${errDetails}`);
      }

      const paypalData = await paypalResponse.json();
      gatewayOrderId = paypalData.id;
      
      const approveLink = paypalData.links.find((l: any) => l.rel === "approve");
      if (!approveLink) {
        throw new Error("No se encontró el enlace de aprobación en la respuesta de PayPal.");
      }
      redirectUrl = approveLink.href;
    }

    // Update internal order with gateway payment ID
    const { error: updateError } = await supabase
      .from("orders")
      .update({ payment_id: gatewayOrderId })
      .eq("id", order.id);

    if (updateError) {
      console.error(`Advertencia: no se pudo guardar payment_id en la orden: ${updateError.message}`);
    }

    return new Response(
      JSON.stringify({ url: redirectUrl, order_id: order.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error en checkout:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
