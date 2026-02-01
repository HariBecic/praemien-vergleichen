# praemien-vergleichen.ch – Next.js Migration

Migration der WordPress-basierten Krankenkassen-Vergleichsseite auf Next.js 15 / Vercel.

## Warum?

| | WordPress (aktuell) | Next.js (neu) |
|---|---|---|
| **Core Web Vitals** | Langsam (PHP + Plugins) | Exzellent (SSG/SSR) |
| **Rechner-Speed** | Server-Roundtrip pro Klick | Instant (Client-side) |
| **SEO** | Plugin-abhängig | Native (Metadata API) |
| **Tech Stack** | Separiert von LeadsHub | Gleicher Stack |
| **Wartung** | Plugins, Updates, Sicherheit | Minimal |

## Quick Start

```bash
# 1. Repo klonen & Dependencies installieren
git clone [repo-url]
cd praemien-vergleichen
npm install

# 2. Environment Variables setzen
cp .env.local.example .env.local
# → Supabase & Meta Credentials eintragen

# 3. BAG-Daten konvertieren (einmalig pro Jahr)
# → Dateien von https://www.priminfo.admin.ch/de/downloads/aktuell herunterladen
# → gesamtbericht_ch.xlsx und praemienregionen.xlsx in /scripts ablegen
npm run convert-data

# 4. Supabase Migration ausführen
# → SQL aus supabase/migrations/001_website_leads.sql im Supabase SQL Editor ausführen

# 5. Entwicklungsserver starten
npm run dev
```

## Projektstruktur

```
├── app/
│   ├── layout.tsx              # SEO, Meta Pixel, Structured Data
│   ├── page.tsx                # Kompletter Onepager
│   ├── globals.css             # Tailwind + Custom Styles
│   └── api/leads/route.ts      # Lead API + Meta Conversions API
├── components/
│   ├── PremiumCalculator.tsx    # 4-Step Rechner (Hauptkomponente)
│   └── Header.tsx              # Sticky Header mit Mobile Menu
├── lib/
│   └── supabase.ts             # Supabase Client
├── data/                       # Generierte JSON-Daten (BAG)
├── scripts/
│   └── convert-bag-data.mjs    # XLSX → JSON Konverter
├── supabase/
│   └── migrations/             # DB Schema
└── public/                     # Static Assets
```

## BAG-Daten Integration

1. **Download** von [priminfo.admin.ch/de/downloads/aktuell](https://www.priminfo.admin.ch/de/downloads/aktuell):
   - "Ganze Schweiz (als Tabelle XLSX)" → `scripts/gesamtbericht_ch.xlsx`
   - "Prämienregionen XLSX" → `scripts/praemienregionen.xlsx`

2. **Konvertieren**: `npm run convert-data`

3. **Ergebnis**: JSON-Dateien in `/data/` – pro Kanton eine Datei für schnelles Laden

## Features

- ✅ 4-Step Multi-Form (wie WordPress, aber schneller)
- ✅ PLZ-basierte Prämienregion-Erkennung
- ✅ Alle 26 Kantone, alle Franchisen, alle Modelle
- ✅ Ergebnisvergleich mit Filtern (Modell, Sortierung)
- ✅ Lead-Erfassung → Supabase → LeadsHub
- ✅ Meta Pixel (Client) + Conversions API (Server)
- ✅ SEO: JSON-LD, Open Graph, Canonical
- ✅ Mobile-optimiert mit Hamburger Menu
- ✅ Testimonials, Benefits, FAQ, CTA Sections

## Deployment

```bash
# Vercel CLI
npm i -g vercel
vercel --prod

# Oder via GitHub Integration in Vercel Dashboard
```

### Domain-Migration (WordPress → Next.js)

1. In Vercel: Domain `praemien-vergleichen.ch` hinzufügen
2. DNS: A-Record auf Vercel IP ändern (oder CNAME auf cname.vercel-dns.com)
3. WordPress abschalten
4. 301-Redirects in `next.config.ts` falls alte URLs existieren

## Environment Variables (Vercel)

```
NEXT_PUBLIC_SUPABASE_URL     → Supabase Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY → Supabase Anon Key
SUPABASE_SERVICE_ROLE_KEY     → Supabase Service Role Key
NEXT_PUBLIC_SITE_URL          → https://praemien-vergleichen.ch
META_PIXEL_ID                 → Facebook Pixel ID
META_ACCESS_TOKEN             → Meta Conversions API Token
```

## TODO

- [ ] Echte BAG-Daten einbinden (XLSX herunterladen + convert-data)
- [ ] PLZ → Region Mapping vervollständigen (aus praemienregionen.xlsx)
- [ ] Testimonial-Bilder migrieren
- [ ] Datenschutz- und Impressum-Seiten erstellen
- [ ] Meta Conversions API Token in Vercel setzen
- [ ] LeadsHub API-Integration für direkte Lead-Weiterleitung
- [ ] A/B Testing Setup (Vercel Edge Config)
