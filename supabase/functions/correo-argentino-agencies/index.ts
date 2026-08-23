import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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
    const baseUrl = Deno.env.get("CORREO_API_BASE_URL");
    const customerId = Deno.env.get("CORREO_CUSTOMER_ID");
    
    if (!baseUrl || !customerId) {
      throw new Error("Faltan variables de entorno para Correo Argentino (URL o Customer ID).");
    }

    const body = await req.json();
    const { provinceCode } = body;

    if (!provinceCode) {
      return new Response(
        JSON.stringify({ error: "Falta provinceCode" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = await getCorreoToken();

    // Use URLSearchParams for x-www-form-urlencoded params in the URL query string
    const queryParams = new URLSearchParams({
      customerId: customerId,
      provinceCode: provinceCode
    });

    const response = await fetch(`${baseUrl}/agencies?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error from MiCorreo Agencies API:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: `MiCorreo API Error: ${response.status}`, details: errorText }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const agencies = await response.json();

    return new Response(JSON.stringify({ agencies }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Agencies function error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
