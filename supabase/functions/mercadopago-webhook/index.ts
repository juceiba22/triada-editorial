import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { getCorreoToken, importShippingToCorreo } from "../_shared/correo-argentino.ts";

serve(async (req) => {
  // We don't need CORS for webhooks as it's called by Mercado Pago,
  // but it doesn't hurt to handle OPTIONS just in case.
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const mpToken = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN");

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error("Missing Supabase environment variables.");
    }
    if (!mpToken) {
      throw new Error("Mercado Pago Access Token no configurado en el servidor.");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Mercado Pago sends notifications in body (Webhook) or query params (IPN)
    const url = new URL(req.url);
    let paymentId = url.searchParams.get("id");
    let topic = url.searchParams.get("topic");

    // Try parsing body if it's JSON
    if (req.method === "POST" && req.headers.get("content-type")?.includes("application/json")) {
      try {
        const body = await req.json();
        console.log("Mercado Pago Webhook Body received:", JSON.stringify(body));

        if (body.type === "payment" && body.data?.id) {
          paymentId = body.data.id;
          topic = "payment";
        } else if (body.action && body.data?.id) {
          // Some webhook versions use action and data.id
          paymentId = body.data.id;
          topic = "payment";
        }
      } catch (e) {
        console.error("Error parsing JSON body, will fallback to query parameters:", e.message);
      }
    }

    // We only process 'payment' topic
    if (paymentId && (topic === "payment" || !topic)) {
      console.log(`Procesando notificación para el pago ID: ${paymentId}`);

      // 1. Fetch payment details from Mercado Pago
      const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${mpToken}`,
        },
      });

      if (!mpResponse.ok) {
        const errText = await mpResponse.text();
        throw new Error(`Error consultando pago en Mercado Pago (ID: ${paymentId}): ${errText}`);
      }

      const paymentData = await mpResponse.json();
      const status = paymentData.status; // e.g. 'approved', 'pending', 'rejected'
      const orderId = paymentData.external_reference; // This matches our internal order.id
      const amount = Number(paymentData.transaction_amount);
      const currency = paymentData.currency_id;
      const payerEmail = paymentData.payer?.email || null;

      console.log(`Detalles del Pago MP: Orden ID: ${orderId}, Estado: ${status}, Monto: ${amount} ${currency}`);

      if (orderId) {
        // Query current order state
        const { data: order, error: orderQueryError } = await supabase
          .from("orders")
          .select("*")
          .eq("id", orderId)
          .single();

        if (orderQueryError || !order) {
          console.error(`La orden ${orderId} no existe en la base de datos.`);
          // Still return 200 OK so MP doesn't retry infinitely
          return new Response(JSON.stringify({ success: false, error: "La orden no existe." }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }

        // If payment is approved, update database
        if (status === "approved") {
          // 1. Update Order status to paid
          const { error: updateOrderError } = await supabase
            .from("orders")
            .update({
              status: "paid",
              payment_id: paymentId,
            })
            .eq("id", orderId);

          if (updateOrderError) {
            throw new Error(`Error al actualizar estado de la orden: ${updateOrderError.message}`);
          }

          // 2. Insert Payment record
          const { error: insertPaymentError } = await supabase
            .from("payments")
            .insert({
              order_id: orderId,
              gateway: "mercadopago",
              external_payment_id: paymentId.toString(),
              payment_status: "approved",
              payment_amount: amount,
              payment_currency: currency,
              payer_email: payerEmail,
              payload: paymentData,
            });

          if (insertPaymentError) {
            console.error(`Advertencia: no se pudo registrar el pago en la tabla: ${insertPaymentError.message}`);
          }

          console.log(`Orden ${orderId} actualizada exitosamente a pagada.`);

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
                .eq("id", orderId);
              
              console.log(`Orden ${orderId} importada a Correo Argentino exitosamente.`);
            } else {
              console.warn("Saltando integración con Correo Argentino: variables no configuradas.");
            }
          } catch (correoError: any) {
            console.error(`Error importando orden ${orderId} a Correo Argentino:`, correoError.message);
            // Log as failed but do not revert payment
            await supabase
              .from("orders")
              .update({ correo_status: "FAILED", correo_imported: false })
              .eq("id", orderId);
          }
        } else if (status === "rejected" || status === "cancelled") {
          // Update order status to failed
          await supabase
            .from("orders")
            .update({ status: "failed" })
            .eq("id", orderId);

          console.log(`Orden ${orderId} marcada como fallida por estado: ${status}`);
        }
      }
    } else {
      console.log("Notificación recibida sin ID de pago o tema de pago relevante.");
    }

    // Always respond with 200/201 OK to Mercado Pago to acknowledge notification receipt
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error en mercadopago-webhook:", error.message);
    // Return 200/OK even on server errors for webhook, but let's log the error.
    // If we return 500, MP will keep retrying. If it is a transient error, retrying is good,
    // but if it is a code bug, retrying clogs logs. We return 500 so MP retries temporarily.
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
