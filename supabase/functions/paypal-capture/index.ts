import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { getCorreoToken, importShippingToCorreo } from "../_shared/correo-argentino.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface CaptureRequest {
  paypal_order_id: string;
  order_id: string;
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
    const body: CaptureRequest = await req.json();

    const { paypal_order_id, order_id } = body;

    if (!paypal_order_id || !order_id) {
      return new Response(
        JSON.stringify({ error: "Faltan paypal_order_id u order_id en la solicitud." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1. Check if the internal order exists and its current status
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", order_id)
      .single();

    if (orderError || !order) {
      return new Response(
        JSON.stringify({ error: "La orden especificada no existe." }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (order.status === "paid") {
      return new Response(
        JSON.stringify({ success: true, message: "La orden ya ha sido pagada previamente." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Authenticate with PayPal
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

    // 3. Capture Payment
    const captureResponse = await fetch(
      `${paypalBaseUrl}/v2/checkout/orders/${paypal_order_id}/capture`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!captureResponse.ok) {
      const errDetails = await captureResponse.text();
      
      // Update order status to failed in DB
      await supabase
        .from("orders")
        .update({ status: "failed" })
        .eq("id", order_id);

      throw new Error(`Error al capturar el pago en PayPal: ${errDetails}`);
    }

    const captureData = await captureResponse.json();

    if (captureData.status === "COMPLETED") {
      // Payment successful!
      const purchaseUnit = captureData.purchase_units[0];
      const captureDetails = purchaseUnit.payments.captures[0];
      const amount = Number(captureDetails.amount.value);
      const currencyCode = captureDetails.amount.currency_code;
      const transactionId = captureDetails.id;
      const payerEmail = captureData.payer?.email_address || null;

      // Start transaction or sequential queries to update DB
      // 1. Update Order
      const { error: updateOrderError } = await supabase
        .from("orders")
        .update({
          status: "paid",
          payment_id: transactionId,
        })
        .eq("id", order_id);

      if (updateOrderError) {
        throw new Error(`Error al actualizar estado de la orden: ${updateOrderError.message}`);
      }

      // 2. Insert Payment record
      const { error: insertPaymentError } = await supabase
        .from("payments")
        .insert({
          order_id: order_id,
          gateway: "paypal",
          external_payment_id: transactionId,
          payment_status: "COMPLETED",
          payment_amount: amount,
          payment_currency: currencyCode,
          payer_email: payerEmail,
          payload: captureData,
        });

      if (insertPaymentError) {
        console.error(`Advertencia: no se pudo guardar el registro de pago: ${insertPaymentError.message}`);
      }

      // 3. Integrate with Correo Argentino
      try {
        const baseUrl = Deno.env.get("CORREO_API_BASE_URL");
        const customerId = Deno.env.get("CORREO_CUSTOMER_ID");
        
        if (baseUrl && customerId) {
          const correoToken = await getCorreoToken();
          const responseData = await importShippingToCorreo(order, customerId, baseUrl, correoToken);
          
          await supabase
            .from("orders")
            .update({ 
                correo_imported: true,
                correo_response: responseData,
                correo_status: "IMPORTED" 
            })
            .eq("id", order_id);
          
          console.log(`Orden ${order_id} importada a Correo Argentino exitosamente.`);
        } else {
          console.warn("Saltando integración con Correo Argentino: variables no configuradas.");
        }
      } catch (correoError: any) {
        console.error(`Error importando orden ${order_id} a Correo Argentino:`, correoError.message);
        // Log as failed but do not revert payment
        await supabase
          .from("orders")
          .update({ correo_status: "FAILED", correo_imported: false })
          .eq("id", order_id);
      }

      return new Response(
        JSON.stringify({ success: true, message: "Pago capturado exitosamente.", order_id }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      // Payment did not complete successfully
      await supabase
        .from("orders")
        .update({ status: "failed" })
        .eq("id", order_id);

      return new Response(
        JSON.stringify({
          error: `El pago no pudo completarse. Estado de PayPal: ${captureData.status}`,
          payload: captureData,
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

  } catch (error) {
    console.error("Error en paypal-capture:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
