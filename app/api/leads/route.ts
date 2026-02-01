import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    // Check env vars
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase env vars:", { url: !!supabaseUrl, key: !!supabaseKey });
      return NextResponse.json(
        { error: "Server-Konfigurationsfehler. Bitte kontaktiere den Administrator.", debug: "missing_env" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const body = await request.json();

    // Validate required fields
    const required = ["name", "email", "phone"];
    for (const field of required) {
      if (!body[field]?.trim()) {
        return NextResponse.json(
          { error: `${field} ist erforderlich` },
          { status: 400 }
        );
      }
    }

    // Insert lead
    const insertData = {
      first_name: body.name.split(" ")[0] || body.name,
      last_name: body.name.split(" ").slice(1).join(" ") || "",
      email: body.email,
      phone: body.phone,
      plz: body.plz || "",
      canton: body.canton || "",
      birth_year: body.birthYear || "",
      age_group: body.ageGroup || "",
      franchise: body.franchise || 0,
      model: body.model || "",
      current_insurer: body.currentInsurer || null,
      source: "praemien-vergleichen.ch",
      cheapest_insurer: body.cheapestInsurer || null,
      cheapest_premium: body.cheapestPremium || null,
      extras: body.extras || [],
      newsletter: body.newsletter || false,
      status: "new",
    };

    const { data, error } = await supabase
      .from("website_leads")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", JSON.stringify(error));
      return NextResponse.json(
        { error: "Fehler beim Speichern", debug: error.message, code: error.code },
        { status: 500 }
      );
    }

    // ─── Meta Conversions API (server-side event tracking) ────────────
    if (process.env.META_ACCESS_TOKEN && process.env.META_PIXEL_ID) {
      try {
        const eventData = {
          data: [{
            event_name: "Lead",
            event_time: Math.floor(Date.now() / 1000),
            action_source: "website",
            event_source_url: "https://praemien-vergleichen.ch",
            user_data: {
              em: [await hashSHA256(body.email.toLowerCase().trim())],
              ph: [await hashSHA256(body.phone.replace(/\D/g, ""))],
              fn: [await hashSHA256(body.name.split(" ")[0].toLowerCase().trim())],
              ln: [await hashSHA256(body.name.split(" ").slice(1).join(" ").toLowerCase().trim())],
              ct: [await hashSHA256(body.ort?.toLowerCase().trim() || "")],
              zp: [await hashSHA256(body.plz || "")],
              country: [await hashSHA256("ch")],
            },
            custom_data: {
              canton: body.canton,
              franchise: body.franchise,
              current_insurer: body.currentInsurer,
              lead_source: "praemien-vergleichen.ch",
            },
          }],
        };

        await fetch(
          `https://graph.facebook.com/v19.0/${process.env.META_PIXEL_ID}/events?access_token=${process.env.META_ACCESS_TOKEN}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(eventData),
          }
        );
      } catch (metaError) {
        console.error("Meta CAPI error:", metaError);
      }
    }

    return NextResponse.json({ success: true, id: data.id }, { status: 201 });
  } catch (err) {
    console.error("Lead error:", err);
    return NextResponse.json(
      { error: "Serverfehler", debug: String(err) },
      { status: 500 }
    );
  }
}

async function hashSHA256(value: string): Promise<string> {
  if (!value) return "";
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
