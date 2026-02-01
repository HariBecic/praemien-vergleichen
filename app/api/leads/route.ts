import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// LeadsHub IDs for praemien-vergleichen.ch
const CATEGORY_ID = "50c84209-9ede-483d-bc12-59d109933004"; // Krankenkasse
const SOURCE_ID = "95d5f786-ca0d-4dc0-adab-af72190fdd1f";   // praemien-vergleichen.ch

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: "Server-Konfigurationsfehler.", debug: "missing_env" },
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

    // Insert into LeadsHub leads table
    const persons = body.persons || [];
    const firstPerson = persons[0] || {};

    console.log("[LEAD POST] persons count:", persons.length, "persons:", JSON.stringify(persons));
    console.log("[LEAD POST] extras:", JSON.stringify(body.extras));

    const { data, error } = await supabase
      .from("leads")
      .insert({
        category_id: CATEGORY_ID,
        source_id: SOURCE_ID,
        first_name: body.name.split(" ")[0] || body.name,
        last_name: body.name.split(" ").slice(1).join(" ") || "",
        email: body.email,
        phone: body.phone,
        plz: body.plz || "",
        ort: body.ort || "",
        extra_data: {
          kanton: body.canton || "",
          berechnungstyp: body.calculationType || "single",
          anzahl_personen: body.personsCount || 1,
          modell: body.model || "",
          aktuelle_kasse: body.currentInsurer || "",
          aktuelle_praemie: body.currentPremium || "",
          guenstigster_versicherer: body.cheapestInsurer || "",
          guenstigste_praemie: body.cheapestPremium || 0,
          zusatzversicherungen: body.extras || [],
          newsletter: body.newsletter || false,
          personen: persons.map((p: any, i: number) => ({
            name: p.name || `Person ${i + 1}`,
            geschlecht: p.gender || "",
            jahrgang: p.birthYear || "",
            altersgruppe: p.ageGroup || "",
            franchise: p.franchise || 0,
            unfalldeckung: p.withAccident || false,
          })),
          jahrgang: firstPerson.birthYear || "",
          altersgruppe: firstPerson.ageGroup || "",
          franchise: firstPerson.franchise || 0,
        },
        status: "new",
      })
      .select()
      .single();

    console.log("[LEAD POST] result id:", data?.id, "error:", error);

    if (error) {
      console.error("Supabase error:", JSON.stringify(error));
      return NextResponse.json(
        { error: "Fehler beim Speichern", debug: error.message, code: error.code },
        { status: 500 }
      );
    }

    // ─── Meta Conversions API ────────────────────────────────────────
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

export async function PATCH(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Server-Konfigurationsfehler." }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Lead ID erforderlich" }, { status: 400 });
    }

    console.log("[LEAD PATCH] id:", body.id, "extras:", JSON.stringify(body.extras));

    // Fetch existing lead to merge extra_data
    const { data: existing } = await supabase
      .from("leads")
      .select("extra_data")
      .eq("id", body.id)
      .single();

    console.log("[LEAD PATCH] existing extra_data keys:", existing ? Object.keys(existing.extra_data || {}) : "NOT FOUND");

    const mergedExtraData = {
      ...(existing?.extra_data || {}),
      zusatzversicherungen: body.extras || [],
    };

    const { error } = await supabase
      .from("leads")
      .update({ extra_data: mergedExtraData })
      .eq("id", body.id);

    console.log("[LEAD PATCH] update error:", error);

    if (error) {
      console.error("Supabase PATCH error:", JSON.stringify(error));
      return NextResponse.json({ error: "Fehler beim Aktualisieren" }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Lead PATCH error:", err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}
