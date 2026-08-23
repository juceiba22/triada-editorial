export const PROVINCE_MAP: Record<string, string> = {
  "buenos aires": "B",
  "capital federal": "C",
  "caba": "C",
  "catamarca": "K",
  "chaco": "H",
  "chubut": "U",
  "cordoba": "X",
  "córdoba": "X",
  "corrientes": "W",
  "entre rios": "E",
  "entre ríos": "E",
  "formosa": "P",
  "jujuy": "Y",
  "la pampa": "L",
  "la rioja": "F",
  "mendoza": "M",
  "misiones": "N",
  "neuquen": "Q",
  "neuquén": "Q",
  "rio negro": "R",
  "río negro": "R",
  "salta": "A",
  "san juan": "J",
  "san luis": "D",
  "santa cruz": "Z",
  "santa fe": "S",
  "santiago del estero": "G",
  "tierra del fuego": "V",
  "tucuman": "T",
  "tucumán": "T",
};

export function getProvinceCode(provinceName: string): string {
  const normalized = (provinceName || "").toLowerCase().trim();
  return PROVINCE_MAP[normalized] || "A";
}

// Simple in-memory cache for the JWT Token
let cachedToken: string | null = null;
let tokenExpiresAt: number = 0; // Unix timestamp in ms

export async function getCorreoToken(): Promise<string> {
  const now = Date.now();
  // Buffer of 5 minutes (300000 ms) before expiration to renew
  if (cachedToken && tokenExpiresAt > now + 300000) {
    return cachedToken;
  }

  const baseUrl = Deno.env.get("CORREO_API_BASE_URL");
  const user = Deno.env.get("CORREO_API_USER");
  const password = Deno.env.get("CORREO_API_PASSWORD");

  if (!baseUrl || !user || !password) {
    throw new Error("Faltan credenciales de MiCorreo en Secrets.");
  }

  const basicAuth = btoa(`${user}:${password}`);
  const response = await fetch(`${baseUrl}/token`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${basicAuth}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error autenticando con MiCorreo: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  if (!data.token) {
    throw new Error("No se recibió token válido de MiCorreo.");
  }

  cachedToken = data.token;
  
  // Parse expiration "2022-04-26 21:16:20" to Date object
  // Replace space with T to make it ISO 8601 parsable or parse manually
  if (data.expires) {
    const expiresIso = data.expires.replace(' ', 'T') + '-03:00'; // Assuming ART timezone from Correo Argentino
    tokenExpiresAt = new Date(expiresIso).getTime();
  } else {
    // Fallback: 1 hour expiration
    tokenExpiresAt = now + 3600000;
  }

  return cachedToken;
}

export async function importShippingToCorreo(order: any, customerId: string, baseUrl: string, token: string) {
  let cart = [];
  if (typeof order.cart === "string") {
    try { cart = JSON.parse(order.cart); } catch(e) {}
  } else if (Array.isArray(order.cart)) {
    cart = order.cart;
  }
  
  const totalBooks = cart.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0) || 1;
  const totalWeight = totalBooks * 400; // 400g per book
  
  const deliveryType = order.correo_delivery_type || "D";
  const productType = order.correo_service || "CP";
  const postalOrigin = Deno.env.get("CORREO_POSTAL_ORIGIN") || "A4400";
  
  const shippingPayload: any = {
    deliveryType: deliveryType,
    productType: productType,
    weight: totalWeight,
    declaredValue: order.total_amount, // Optional depending on API, but good to have
    height: 15,
    length: 30,
    width: 20
  };

  // Only required if sending to Agency (S)
  if (deliveryType === "S" && order.correo_agency) {
    shippingPayload.agency = order.correo_agency;
    // Address is also required according to API docs for S if we are doing Agency Delivery? 
    // Docs say for Sucursal: shipping.agency is mandatory. shipping.address is also in the payload.
    shippingPayload.address = {
      streetName: "Sucursal",
      streetNumber: "0",
      floor: "",
      apartment: "",
      city: order.shipping_city,
      provinceCode: getProvinceCode(order.shipping_state),
      postalCode: order.shipping_zip
    };
  } else {
    // For Domicilio, address is inside shipping payload? No, wait.
    // Re-reading PDF: "shipping.address is required (streetName, streetNumber)" for BOTH?
    // Actually the PDF example for Domicilio doesn't include shipping.address at all, just deliveryType "D"
    // So we don't include it. Wait, the PDF says: "Solo obligatorios para envio a Domicilio: weight, declaredValue, height, length, width".
    // Let's stick to the PDF.
  }
  
  const payload = {
    customerId: customerId,
    extOrderId: order.id,
    orderNumber: order.id,
    sender: {
      name: null,
      phone: null,
      cellPhone: null,
      email: null,
      originAddress: {
        streetName: null,
        streetNumber: null,
        floor: null,
        apartment: null,
        city: null,
        provinceCode: null,
        postalCode: null
      }
    },
    recipient: {
      name: order.customer_name,
      phone: order.customer_phone || "",
      cellPhone: "",
      email: order.customer_email || "no-reply@modesta.com"
    },
    shipping: shippingPayload
  };

  // If Domicilio, add shipping.address (wait, the PDF says shipping.address is "Nombre de la calle de la dirección de envío").
  // Ah! "shipping.address.streetName * Nombre de la calle de la dirección de envío."
  // Wait! Looking at the Envío a Domicilio Request Example in PDF on Page 13:
  // It has NO shipping.address at all! It only has "recipient" which does NOT have an address.
  // Wait, where does the destination address go for Domicilio?!
  // Oh, my bad. Looking at the "Envío a Domicilio" Request Example in the PDF: it DOES NOT have an address?
  // Let me re-read the PDF. It literally says:
  // "shipping.address.streetName * Nombre de la calle... (No * for required?) No, it has an asterisk!
  // * Solo obligatorios para envio a Domicilio (shipping.deliveryType != "S").
  // So shipping.address IS required for Domicilio.
  // I will add it for Domicilio.

  if (deliveryType === "D") {
    payload.shipping.address = {
      streetName: order.shipping_address,
      streetNumber: "S/N", // Extract if possible, or fallback
      floor: "",
      apartment: "",
      city: order.shipping_city,
      provinceCode: getProvinceCode(order.shipping_state),
      postalCode: order.shipping_zip
    };
  }

  console.log("Enviando a MiCorreo import:", JSON.stringify(payload));

  const response = await fetch(`${baseUrl}/shipping/import`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`MiCorreo Import API Error: ${response.status} - ${errText}`);
  }

  return await response.json();
}
