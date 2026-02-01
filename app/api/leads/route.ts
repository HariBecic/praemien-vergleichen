import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client (with service role for writes)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
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
    const { data, error } = await supabase.from("website_leads").insert({
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
    }).select().single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "Fehler beim Speichern" }, { status: 500 });
    }

    // ─── Meta Conversions API (server-side event tracking) ────────────
    // This sends a Lead event to Facebook for better attribution
    if (process.env.META_ACCESS_TOKEN && process.env.META_PIXEL_ID) {
      try {
        const eventData = {
          data: [{
            event_name: "Lead",
            event_time: Math.floor(Date.now() / 1000),
            action_source: "website",
            event_source_url: "https://praemien-vergleichen.ch",
            user_data: {
              em: [hashSHA256(body.email.toLowerCase().trim())],
              ph: [hashSHA256(body.phone.replace(/\D/g, ""))],
              fn: [hashSHA256(body.name.split(" ")[0].toLowerCase().trim())],
              ln: [hashSHA256(body.name.split(" ").slice(1).join(" ").toLowerCase().trim())],
              ct: [hashSHA256(body.ort?.toLowerCase().trim() || "")],
              zp: [hashSHA256(body.plz || "")],
              country: [hashSHA256("ch")],
            },
            custom_data: {
              canton: body.canton,
              franchise: body.franchise,
              current_insurer: body.currentInsurer,
              lead_source: "praemien-vergleichen.ch",
            },
          }],
          // test_event_code: "TEST12345", // Uncomment for testing
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
        // Don't fail the request if Meta tracking fails
      }
    }

    return NextResponse.json({ success: true, id: data.id }, { status: 201 });
  } catch (err) {
    console.error("Lead error:", err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}

// Simple SHA-256 hash for Meta CAPI (server-side)
async function hashSHA256(value: string): Promise<string> {
  if (!value) return "";
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
