#!/usr/bin/env node
/**
 * BAG-Prämiendaten Konverter
 * 
 * Konvertiert die offizielle BAG XLSX-Datei (gesamtbericht_ch.xlsx) und die
 * Prämienregionen-Datei in optimierte JSON-Dateien für den Prämienrechner.
 * 
 * Anleitung:
 * 1. Lade die Dateien von https://www.priminfo.admin.ch/de/downloads/aktuell herunter:
 *    - "Ganze Schweiz (als Tabelle XLSX)" → speichere als gesamtbericht_ch.xlsx
 *    - "Prämienregionen" → speichere als praemienregionen.xlsx
 * 
 * 2. Lege beide Dateien in den /scripts Ordner
 * 
 * 3. Führe das Script aus:
 *    cd scripts
 *    npm install xlsx
 *    node convert-bag-data.mjs
 * 
 * 4. Die generierten JSON-Dateien werden in /data abgelegt:
 *    - premiums-2026.json      (alle Prämien, nach Kanton aufgeteilt)
 *    - regions.json             (PLZ → Prämienregion Mapping)
 *    - insurers.json            (Liste aller Versicherer)
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "data");

async function main() {
  // Dynamic import for xlsx (needs to be installed first)
  let XLSX;
  try {
    XLSX = await import("xlsx");
  } catch {
    console.error("❌ Bitte zuerst installieren: npm install xlsx");
    process.exit(1);
  }

  // ─── 1. Prämienregionen konvertieren ─────────────────────────────────────
  const regionsFile = join(__dirname, "praemienregionen.xlsx");
  if (existsSync(regionsFile)) {
    console.log("📍 Verarbeite Prämienregionen...");
    const wb = XLSX.readFile(regionsFile);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(ws);

    // Map PLZ → { canton, region }
    // Die Spalten können variieren - hier die gängigsten Varianten
    const regionMap = {};
    for (const row of rows) {
      const plz = String(
        row["PLZ"] || row["Postleitzahl"] || row["plz"] || ""
      ).trim();
      const canton =
        row["Kanton"] || row["Canton"] || row["kanton"] || row["KT"] || "";
      const region =
        row["Prämienregion"] ||
        row["Region"] ||
        row["Praemienregion"] ||
        row["PR"] ||
        "";

      if (plz && canton) {
        if (!regionMap[plz]) {
          regionMap[plz] = [];
        }
        regionMap[plz].push({
          canton: String(canton).trim(),
          region: parseInt(String(region)) || 0,
          ort:
            String(
              row["Ortsbezeichnung"] || row["Ort"] || row["Ortschaft"] || ""
            ).trim() || undefined,
          gemeinde:
            String(row["Gemeindename"] || row["Gemeinde"] || "").trim() ||
            undefined,
        });
      }
    }

    writeFileSync(
      join(DATA_DIR, "regions.json"),
      JSON.stringify(regionMap, null, 0) // Kompakt für kleinere Dateigrösse
    );
    console.log(
      `   ✅ ${Object.keys(regionMap).length} PLZ-Einträge → data/regions.json`
    );
  } else {
    console.log(
      "⚠️  praemienregionen.xlsx nicht gefunden – Regionen werden übersprungen"
    );
    console.log(
      "   Download: https://www.priminfo.admin.ch/de/downloads/aktuell"
    );
  }

  // ─── 2. Prämiendaten konvertieren ────────────────────────────────────────
  const premiumsFile = join(__dirname, "gesamtbericht_ch.xlsx");
  if (!existsSync(premiumsFile)) {
    console.error("❌ gesamtbericht_ch.xlsx nicht gefunden!");
    console.error(
      "   Download: https://www.priminfo.admin.ch/de/downloads/aktuell"
    );
    console.error('   → "Ganze Schweiz (als Tabelle XLSX)"');
    process.exit(1);
  }

  console.log("📊 Verarbeite Prämiendaten...");
  const wb = XLSX.readFile(premiumsFile);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws);

  console.log(`   ${rows.length} Zeilen gelesen`);

  // Debug: Print column names from first row
  if (rows.length > 0) {
    console.log("   Spalten:", Object.keys(rows[0]).join(", "));
  }

  // ─── Spalten-Mapping ──────────────────────────────────────────────────
  // Die BAG-Datei hat typischerweise diese Spalten (können variieren):
  // Kanton, Prämienregion, Altersklasse, Franchise, Unfall,
  // Versicherer-Nr, Versicherer, Tarifbezeichnung, Tariftyp, Prämie
  //
  // Wir versuchen, die Spalten intelligent zu erkennen

  function findColumn(row, ...candidates) {
    for (const key of Object.keys(row)) {
      const lower = key.toLowerCase().replace(/[^a-zäöü0-9]/g, "");
      for (const candidate of candidates) {
        if (lower.includes(candidate.toLowerCase())) return key;
      }
    }
    return null;
  }

  const firstRow = rows[0];
  const COL = {
    canton: findColumn(firstRow, "kanton", "canton", "kt"),
    region: findColumn(firstRow, "prämienregion", "praemienregion", "region"),
    ageGroup: findColumn(firstRow, "altersklasse", "alter", "age"),
    franchise: findColumn(firstRow, "franchise"),
    accident: findColumn(firstRow, "unfall", "accident"),
    insurerNr: findColumn(firstRow, "versicherernr", "versicherer-nr", "nr"),
    insurer: findColumn(firstRow, "versicherer", "insurer", "kasse"),
    tariffName: findColumn(firstRow, "tarifbezeichnung", "tarif", "modell"),
    tariffType: findColumn(firstRow, "tariftyp", "typ"),
    premium: findColumn(firstRow, "prämie", "praemie", "premium", "monatsprämie"),
  };

  console.log("   Erkannte Spalten:", JSON.stringify(COL, null, 2));

  // Validate essential columns
  if (!COL.canton || !COL.premium || !COL.insurer) {
    console.error("❌ Konnte die wichtigsten Spalten nicht erkennen.");
    console.error(
      "   Bitte prüfe die XLSX-Datei und passe das Spalten-Mapping manuell an."
    );
    console.error("   Vorhandene Spalten:", Object.keys(firstRow));
    process.exit(1);
  }

  // ─── Daten aufbereiten ────────────────────────────────────────────────
  // Wir gruppieren nach Kanton für dynamisches Laden

  const premiumsByCanton = {};
  const insurerSet = new Map(); // nr → name

  // Map age groups
  function mapAgeGroup(val) {
    const s = String(val).toLowerCase();
    if (s.includes("kind") || s.includes("kin") || s === "0-18") return "KIN";
    if (
      s.includes("junge") ||
      s.includes("jug") ||
      s === "19-25" ||
      s.includes("young")
    )
      return "JUG";
    return "ERW"; // Default: Erwachsene
  }

  // Map tariff types to our model identifiers
  function mapTariffType(val) {
    const s = String(val).toLowerCase();
    if (s.includes("standard") || s.includes("basis")) return "standard";
    if (s.includes("hausarzt") || s.includes("family") || s.includes("hau"))
      return "hausarzt";
    if (s.includes("hmo")) return "hmo";
    if (s.includes("telmed") || s.includes("tele")) return "telmed";
    return "other";
  }

  let processed = 0;
  let skipped = 0;

  for (const row of rows) {
    const canton = String(row[COL.canton] || "").trim();
    const premium = parseFloat(String(row[COL.premium] || "").replace(",", "."));

    if (!canton || isNaN(premium) || premium <= 0) {
      skipped++;
      continue;
    }

    const entry = {
      r: parseInt(String(row[COL.region] || "0")) || 0, // region
      a: mapAgeGroup(row[COL.ageGroup]), // ageGroup
      f: parseInt(String(row[COL.franchise] || "0")) || 0, // franchise
      u: String(row[COL.accident] || "")
        .toLowerCase()
        .includes("mit")
        ? 1
        : 0, // withAccident (1=yes, 0=no)
      i: String(row[COL.insurerNr] || "").trim(), // insurer nr
      n: String(row[COL.insurer] || "").trim(), // insurer name
      t: String(row[COL.tariffName] || "").trim(), // tariff name
      m: mapTariffType(row[COL.tariffType]), // model
      p: Math.round(premium * 100) / 100, // monthly premium
    };

    // Track insurers
    if (entry.i && entry.n) {
      insurerSet.set(entry.i, entry.n);
    }

    if (!premiumsByCanton[canton]) {
      premiumsByCanton[canton] = [];
    }
    premiumsByCanton[canton].push(entry);
    processed++;
  }

  console.log(`   ✅ ${processed} Prämien verarbeitet, ${skipped} übersprungen`);

  // ─── JSON-Dateien schreiben ───────────────────────────────────────────

  // Individual canton files (for dynamic loading)
  for (const [canton, entries] of Object.entries(premiumsByCanton)) {
    writeFileSync(
      join(DATA_DIR, `premiums-${canton}.json`),
      JSON.stringify(entries)
    );
  }
  console.log(
    `   ✅ ${Object.keys(premiumsByCanton).length} Kantonsdateien → data/premiums-{KT}.json`
  );

  // Complete file (for static bundling if preferred)
  writeFileSync(
    join(DATA_DIR, "premiums-2026.json"),
    JSON.stringify(premiumsByCanton)
  );
  console.log("   ✅ Gesamtdatei → data/premiums-2026.json");

  // Insurers list
  const insurers = Array.from(insurerSet.entries())
    .map(([nr, name]) => ({ nr, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
  writeFileSync(join(DATA_DIR, "insurers.json"), JSON.stringify(insurers, null, 2));
  console.log(`   ✅ ${insurers.length} Versicherer → data/insurers.json`);

  // ─── Stats ────────────────────────────────────────────────────────────
  console.log("\n📈 Zusammenfassung:");
  console.log(`   Kantone: ${Object.keys(premiumsByCanton).length}`);
  console.log(`   Versicherer: ${insurers.length}`);
  console.log(`   Prämieneinträge: ${processed}`);
  console.log(`\n✨ Fertig! Die Daten sind bereit für den Prämienrechner.`);
}

main().catch(console.error);
