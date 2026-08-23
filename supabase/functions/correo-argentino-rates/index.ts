import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getCorreoToken } from "../_shared/correo-argentino.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // CORS Preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const baseUrl = Deno.env.get("CORREO_API_BASE_URL");
    const customerId = Deno.env.get("CORREO_CUSTOMER_ID");
    const postalOrigin = Deno.env.get("CORREO_POSTAL_ORIGIN") || "A4400";
    
    if (!baseUrl || !customerId) {
      throw new Error("Faltan variables de entorno para Correo Argentino (URL o Customer ID).");
    }

    const body = await req.json();
    const { postalCodeDestination, totalQuantity } = body;

    if (!postalCodeDestination) {
      return new Response(
        JSON.stringify({ error: "Falta postalCodeDestination" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const quantity = totalQuantity || 1;
    const totalWeight = quantity * 400; // 400 grams per book

    const token = await getCorreoToken();

    // Rates payload - the API returns an array for both Delivery types if not specified
    const payload = {
      customerId: customerId,
      postalCodeOrigin: postalOrigin,
      postalCodeDestination: postalCodeDestination,
      dimensions: {
        weight: totalWeight, // integer grams
        height: 15, // cm
        width: 20, // cm
        length: 30, // cm
      }
    };

    const response = await fetch(`${baseUrl}/rates`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error from MiCorreo Rates API:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: `MiCorreo API Error: ${response.status}`, details: errorText }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const ratesResponse = await response.json();

    return new Response(JSON.stringify(ratesResponse), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Rates function error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
