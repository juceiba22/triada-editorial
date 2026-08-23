import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { getCorreoToken } from "../_shared/correo-argentino.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const baseUrl = Deno.env.get("CORREO_API_BASE_URL");
    
    if (!supabaseUrl || !supabaseServiceRoleKey || !baseUrl) {
      throw new Error("Missing Supabase or Correo Argentino environment variables.");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const body = await req.json();
    const { shippingId, orderId } = body;

    if (!shippingId) {
      return new Response(
        JSON.stringify({ error: "Falta shippingId" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = await getCorreoToken();

    // El PDF de MiCorreo dice que es un GET pero con body JSON (extraño, pero lo respetamos si es Deno.
    // Si la API no lo soporta en Deno, podríamos necesitar enviar como POST o usar query params, 
    // pero el PDF dice explícitamente: curl -X GET ... -d '{"shippingId":"..."}'
    // fetch() en Deno permite GET con body, pero algunos proxies lo bloquean. Probamos enviarlo.
    const requestOptions = {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ shippingId })
    };

    const response = await fetch(`${baseUrl}/shipping/tracking`, requestOptions);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error from MiCorreo Tracking API:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: `MiCorreo API Error: ${response.status}`, details: errorText }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const trackingData = await response.json();

    // Extract the latest event status
    let latestStatus = "UNKNOWN";
    let trackingNumber = null;
    
    // Response is an array of tracking objects
    if (Array.isArray(trackingData) && trackingData.length > 0) {
        const trackingObj = trackingData[0];
        trackingNumber = trackingObj.trackingNumber;
        
        if (trackingObj.events && trackingObj.events.length > 0) {
            // Sort by date or assume the first/last is the latest. 
            // Usually the first in the array is the latest.
            latestStatus = trackingObj.events[0].event;
        }
    }

    // Update database if orderId was provided
    if (orderId && trackingNumber) {
        await supabase
          .from("orders")
          .update({ 
            correo_tracking: trackingNumber,
            correo_status: latestStatus
          })
          .eq("id", orderId);
    } else if (shippingId && trackingNumber) {
        // Fallback update by correo_order if orderId wasn't passed but we know the extOrderId is shippingId
        await supabase
          .from("orders")
          .update({ 
            correo_tracking: trackingNumber,
            correo_status: latestStatus
          })
          .eq("id", shippingId);
    }

    return new Response(JSON.stringify({ trackingData, latestStatus }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Tracking function error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
