import { PremiumCalculator } from "@/components/PremiumCalculator";
import { InsurerCarousel } from "@/components/InsurerCarousel";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Krankenkasse Schweiz 2026 | Prämien vergleichen & CHF 2'000 sparen",
  description:
    "Krankenkasse vergleichen 2026: Kostenloser Prämienrechner für alle 27 Schweizer Krankenkassen. Offizielle BAG-Daten, alle Kantone, alle Franchisen. Jetzt bis CHF 2'000 pro Jahr sparen!",
  alternates: {
    canonical: "https://praemien-vergleichen.ch",
  },
};

const FAQ_ITEMS = [
  // Fristen & Wechsel
  {
    q: "Bis wann muss ich die Krankenkasse kündigen 2026?",
    a: "Für einen Wechsel per 1. Januar 2026 müssen Sie bis spätestens 30. November 2025 kündigen. Die Kündigung muss eingetroffen sein (nicht Poststempel). Tipp: Per Einschreiben senden oder online kündigen.",
  },
  {
    q: "Kann ich die Krankenkasse auch im Sommer wechseln?",
    a: "Ja, zum 1. Juli ist ein Wechsel möglich – aber nur bei der ordentlichen Franchise (CHF 300). Die Kündigung muss bis 31. März bei der Krankenkasse eingetroffen sein. Bei höheren Franchisen ist nur ein Wechsel per 1. Januar möglich.",
  },
  // Kosten & Franchise
  {
    q: "Welche Franchise soll ich wählen – CHF 300 oder CHF 2'500?",
    a: "Faustregel: Wählen Sie CHF 2'500, wenn Sie selten zum Arzt gehen und die Ersparnis in einem Notfallfonds anlegen. Bei regelmässigen Arztbesuchen (z.B. Chroniker) lohnt sich CHF 300. Mit CHF 2'500 sparen Sie bis zu CHF 1'500 pro Jahr an Prämien.",
  },
  {
    q: "Wie viel kostet die Krankenkasse pro Monat in der Schweiz?",
    a: "Die durchschnittliche Prämie 2026 beträgt CHF 393.30 pro Monat (Erwachsene, Franchise CHF 300). Je nach Kanton variiert sie stark: In Appenzell Innerrhoden ab CHF 260, in Genf ab CHF 480. Mit alternativen Modellen (HMO, Hausarzt) sparen Sie 10–25%.",
  },
  {
    q: "Habe ich Anspruch auf Prämienverbilligung (IPV)?",
    a: "Das hängt von Ihrem Einkommen und Wohnkanton ab. Grob gilt: Einzelpersonen mit einem steuerbaren Einkommen unter CHF 40'000–50'000 und Familien unter CHF 60'000–80'000 können Prämienverbilligung beantragen. Der Antrag erfolgt bei Ihrer Wohngemeinde oder dem Kanton.",
  },
  // Leistungen
  {
    q: "Zahlt die Krankenkasse den Zahnarzt?",
    a: "Nein, Zahnbehandlungen sind NICHT in der Grundversicherung enthalten. Ausnahmen: Unfälle, schwere Kiefererkrankungen oder Zahnprobleme durch andere Krankheiten. Für Zahnarztkosten benötigen Sie eine Zahnzusatzversicherung.",
  },
  {
    q: "Übernimmt die Krankenkasse meine Brille oder Kontaktlinsen?",
    a: "Nur für Kinder bis 18 Jahre: CHF 180 pro Jahr für Brillen/Kontaktlinsen. Erwachsene erhalten seit 2020 keinen Beitrag mehr aus der Grundversicherung. Eine Zusatzversicherung kann Sehhilfen abdecken.",
  },
  {
    q: "Was bezahlt die Grundversicherung bei Schwangerschaft?",
    a: "Die Grundversicherung übernimmt: 7 Vorsorgeuntersuchungen, 2 Ultraschalls, Geburtskosten (Spital/Geburtshaus), Nachkontrollen und Stillberatung. Ab der 13. Schwangerschaftswoche bis 8 Wochen nach Geburt entfällt die Franchise und der Selbstbehalt.",
  },
  // Modelle
  {
    q: "Was ist der Unterschied zwischen HMO, Hausarzt und Telmed?",
    a: "HMO: Sie gehen immer zuerst in ein HMO-Zentrum (Gruppenpraxis). Hausarzt-Modell: Ihr Hausarzt ist erste Anlaufstelle. Telmed: Zuerst telefonische Beratung (z.B. Medgate). Alle Modelle sparen 10–25% Prämien, schränken aber die freie Arztwahl ein.",
  },
  // Spezialfälle
  {
    q: "Soll ich die Unfallversicherung einschliessen oder ausschliessen?",
    a: "Ausschliessen, wenn Sie mindestens 8 Stunden pro Woche arbeiten – dann sind Sie über den Arbeitgeber unfallversichert (UVG). Dies spart ca. 7% der Prämie. Selbstständige, Hausfrauen/-männer und Studierende müssen Unfall einschliessen.",
  },
  {
    q: "Wie melde ich mein Neugeborenes bei der Krankenkasse an?",
    a: "Sie haben 3 Monate Zeit nach der Geburt. Das Kind kann rückwirkend ab Geburt versichert werden. Die Krankenkasse darf das Kind nicht ablehnen (Aufnahmepflicht). Tipp: Kind bei einer günstigen Kasse anmelden – es muss nicht die gleiche wie die Eltern sein.",
  },
  {
    q: "Ist die Krankenkasse in der Schweiz obligatorisch?",
    a: "Ja, die Grundversicherung (KVG) ist für alle Personen mit Wohnsitz in der Schweiz Pflicht. Sie haben 3 Monate Zeit nach Zuzug, sich zu versichern. Zusatzversicherungen sind freiwillig.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a,
    },
  })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main>
        {/* ── Hero ── */}
        <section className="relative overflow-hidden pt-28 pb-16 sm:pt-40 sm:pb-28">
          {/* Background effects */}
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-blue-500/[0.06] blur-[100px] pointer-events-none" />
          <div className="absolute top-40 right-0 w-[300px] h-[300px] rounded-full bg-orange-500/[0.04] blur-[80px] pointer-events-none" />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.1] bg-white/[0.04] backdrop-blur-sm text-sm text-white/60 mb-6">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Offizielle BAG-Prämien 2026
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
                <span className="block text-2xl sm:text-3xl font-semibold text-white/70 mb-2">
                  Krankenkasse Schweiz 2026
                </span>
                Spare bis zu{" "}
                <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
                  CHF 2&apos;000
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
                Kostenloser <strong>Krankenkassenvergleich</strong> in nur 2 Minuten.
                Finden Sie jetzt die günstigste Krankenkasse für 2026 – mit offiziellen BAG-Daten!
              </p>

              <a
                href="#formular"
                className="btn-accent text-lg px-8 py-4 rounded-2xl"
              >
                Jetzt vergleichen!
              </a>

              {/* Google-style rating */}
              <div className="flex items-center justify-center gap-2 mt-6">
                <div className="flex gap-0.5 text-orange-400">
                  {"★★★★★".split("").map((s, i) => (
                    <span key={i} className="text-lg">{s}</span>
                  ))}
                </div>
                <span className="text-sm text-white/50">
                  <span className="font-semibold text-white/70">4.9</span> / 5 – über 500 Vergleiche
                </span>
              </div>

              {/* Stats pills */}
              <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
                {[
                  { value: "217'000+", label: "Tarife verglichen" },
                  { value: "27", label: "Versicherer" },
                  { value: "100%", label: "Kostenlos" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06]"
                  >
                    <span className="font-bold text-white">{stat.value}</span>
                    <span className="text-sm text-white/40">{stat.label}</span>
                  </div>
                ))}
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mt-10 pt-8 border-t border-white/[0.06]">
                {/* Swiss Data Protection */}
                <div className="flex items-center gap-2 text-white/35">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  <span className="text-xs font-medium">Schweizer Datenschutz</span>
                </div>

                {/* Official BAG Data */}
                <div className="flex items-center gap-2 text-white/35">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  <span className="text-xs font-medium">Offizielle BAG-Daten</span>
                </div>

                {/* SSL Encrypted */}
                <div className="flex items-center gap-2 text-white/35">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  <span className="text-xs font-medium">SSL-verschlüsselt</span>
                </div>

                {/* Free & no obligation */}
                <div className="flex items-center gap-2 text-white/35">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs font-medium">100% unverbindlich</span>
                </div>
              </div>

              {/* Insurer logos carousel */}
              <InsurerCarousel />
            </div>
          </div>
        </section>

        {/* ── Calculator Section ── */}
        <section id="formular" className="py-16 sm:py-24" style={{ scrollMarginTop: "4rem" }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <PremiumCalculator />
          </div>
        </section>

        {/* ── Key Facts (Visual Infographic Style) ── */}
        <section className="py-16 sm:py-24 border-t border-white/[0.06]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
              Krankenkasse Schweiz – Fakten 2026
            </h2>
            <p className="text-center text-white/50 mb-12 max-w-2xl mx-auto">
              Die wichtigsten Zahlen zur obligatorischen Krankenversicherung in der Schweiz auf einen Blick.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { value: "27", label: "Krankenkassen", sub: "zugelassene Versicherer" },
                { value: "CHF 393", label: "Ø Prämie/Monat", sub: "Erwachsene 2026" },
                { value: "+4.4%", label: "Prämienanstieg", sub: "gegenüber 2025" },
                { value: "CHF 2'000", label: "Sparpotenzial", sub: "pro Jahr möglich" },
              ].map((fact) => (
                <div key={fact.label} className="text-center p-6 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent mb-2">
                    {fact.value}
                  </div>
                  <div className="font-semibold text-white">{fact.label}</div>
                  <div className="text-xs text-white/40 mt-1">{fact.sub}</div>
                </div>
              ))}
            </div>

            {/* Info text */}
            <div className="mt-12 p-6 rounded-xl bg-blue-500/[0.08] border border-blue-500/20">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Wussten Sie?</h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    Die Leistungen der <strong>Grundversicherung (KVG)</strong> sind bei allen 27 Schweizer Krankenkassen
                    gesetzlich vorgeschrieben und daher <strong>identisch</strong>. Der einzige Unterschied liegt im Preis –
                    deshalb lohnt sich ein regelmässiger Vergleich. Mit dem Wechsel zur günstigsten Kasse sparen Sie
                    bis zu CHF 2&apos;000 pro Jahr bei exakt gleichen Leistungen.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Krankenkassen Kantone (Visual Grid) ── */}
        <section className="py-16 sm:py-24 border-t border-white/[0.06]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <p className="text-center text-sm text-white/40 uppercase tracking-wider mb-2">
              Prämien nach Region
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
              Krankenkasse in Ihrem Kanton
            </h2>
            <p className="text-center text-white/50 mb-10 max-w-2xl mx-auto">
              Die Prämien unterscheiden sich stark je nach Wohnkanton. Finden Sie die günstigste Krankenkasse für Ihren Standort.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {[
                { name: "Zürich", slug: "zuerich", price: "ab CHF 340" },
                { name: "Bern", slug: "bern", price: "ab CHF 290" },
                { name: "Basel-Stadt", slug: "basel-stadt", price: "ab CHF 350" },
                { name: "Aargau", slug: "aargau", price: "ab CHF 310" },
                { name: "St. Gallen", slug: "st-gallen", price: "ab CHF 280" },
                { name: "Luzern", slug: "luzern", price: "ab CHF 295" },
                { name: "Genf", slug: "genf", price: "ab CHF 420" },
                { name: "Waadt", slug: "waadt", price: "ab CHF 380" },
              ].map((kanton) => (
                <Link
                  key={kanton.slug}
                  href={`/kanton/${kanton.slug}`}
                  className="group p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-orange-500/30 hover:bg-white/[0.05] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-white group-hover:text-orange-400 transition-colors">
                        {kanton.name}
                      </div>
                      <div className="text-xs text-white/40">{kanton.price}/Mt.</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                href="/kanton"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.08] hover:border-white/[0.15] text-white font-medium transition-all"
              >
                Alle 26 Kantone anzeigen
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Ratgeber Cards (Visual) ── */}
        <section className="py-16 sm:py-24 border-t border-white/[0.06]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <p className="text-center text-sm text-white/40 uppercase tracking-wider mb-2">
              Wissen & Tipps
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
              Krankenkassen-Ratgeber
            </h2>
            <p className="text-center text-white/50 mb-10 max-w-2xl mx-auto">
              Alles was Sie über Krankenkassen in der Schweiz wissen müssen – von Experten erklärt.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: "Krankenkasse wechseln",
                  desc: "Anleitung, Fristen und Musterkündigung für den Wechsel 2026",
                  slug: "krankenkasse-wechseln",
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                    </svg>
                  ),
                  color: "from-green-500/20 to-emerald-500/10",
                  iconColor: "text-green-400",
                },
                {
                  title: "Franchise wählen",
                  desc: "CHF 300 oder CHF 2'500? So finden Sie die optimale Franchise",
                  slug: "franchise-waehlen",
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  color: "from-blue-500/20 to-indigo-500/10",
                  iconColor: "text-blue-400",
                },
                {
                  title: "Versicherungsmodelle",
                  desc: "Hausarzt, HMO oder Telmed – welches Modell spart am meisten?",
                  slug: "versicherungsmodelle",
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                    </svg>
                  ),
                  color: "from-purple-500/20 to-violet-500/10",
                  iconColor: "text-purple-400",
                },
                {
                  title: "Prämienverbilligung",
                  desc: "Wer hat Anspruch? So beantragen Sie IPV in Ihrem Kanton",
                  slug: "praemienverbilligung",
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                    </svg>
                  ),
                  color: "from-orange-500/20 to-amber-500/10",
                  iconColor: "text-orange-400",
                },
                {
                  title: "Grundversicherung",
                  desc: "Welche Leistungen sind in der obligatorischen Versicherung enthalten?",
                  slug: "grundversicherung-leistungen",
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  ),
                  color: "from-cyan-500/20 to-teal-500/10",
                  iconColor: "text-cyan-400",
                },
                {
                  title: "Prämien 2026",
                  desc: "Alle Änderungen im Überblick – so sparen Sie trotz Erhöhung",
                  slug: "praemien-2026",
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                    </svg>
                  ),
                  color: "from-red-500/20 to-rose-500/10",
                  iconColor: "text-red-400",
                },
              ].map((article) => (
                <Link
                  key={article.slug}
                  href={`/ratgeber/${article.slug}`}
                  className="group p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-orange-500/30 hover:bg-white/[0.05] transition-all"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${article.color} flex items-center justify-center mb-4`}>
                    <span className={article.iconColor}>{article.icon}</span>
                  </div>
                  <h3 className="font-bold text-white group-hover:text-orange-400 transition-colors mb-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed">
                    {article.desc}
                  </p>
                  <span className="inline-block mt-3 text-xs font-medium text-blue-400 group-hover:text-blue-300">
                    Weiterlesen →
                  </span>
                </Link>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                href="/ratgeber"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.08] hover:border-white/[0.15] text-white font-medium transition-all"
              >
                Alle Ratgeber anzeigen
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" style={{ scrollMarginTop: "4rem" }} className="py-16 sm:py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <p className="text-center text-sm text-white/40 uppercase tracking-wider mb-2">
              Ihre Fragen zur Krankenkasse beantwortet
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10">
              Häufig gestellte Fragen zur Krankenkasse
            </h2>

            <div className="space-y-3">
              {FAQ_ITEMS.map((faq) => (
                <details key={faq.q} className="card p-5 cursor-pointer group">
                  <summary className="flex items-center justify-between font-semibold text-white list-none">
                    {faq.q}
                    <svg
                      className="w-5 h-5 text-white/30 group-open:rotate-180 transition-transform flex-shrink-0"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-3 text-white/50 leading-relaxed text-sm">{faq.a}</p>
                </details>
              ))}
            </div>

            {/* More info links */}
            <div className="mt-8 text-center">
              <p className="text-white/40 text-sm mb-4">
                Mehr Informationen zu Krankenkassen finden Sie in unserem Ratgeber:
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/ratgeber/krankenkasse-wechseln" className="text-sm text-blue-400 hover:text-blue-300 underline underline-offset-2">
                  Krankenkasse wechseln
                </Link>
                <Link href="/ratgeber/franchise-waehlen" className="text-sm text-blue-400 hover:text-blue-300 underline underline-offset-2">
                  Franchise wählen
                </Link>
                <Link href="/ratgeber/versicherungsmodelle" className="text-sm text-blue-400 hover:text-blue-300 underline underline-offset-2">
                  Versicherungsmodelle
                </Link>
                <Link href="/ratgeber/praemienverbilligung" className="text-sm text-blue-400 hover:text-blue-300 underline underline-offset-2">
                  Prämienverbilligung
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="py-16 sm:py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="card-elevated p-10 sm:p-14 text-center relative overflow-hidden">
              {/* Glow accent */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Starten Sie jetzt Ihren kostenlosen Krankenkassenvergleich
              </h2>
              <p className="text-white/50 mb-8 max-w-lg mx-auto">
                Über 217&apos;000 Tarife von 27 Schweizer Krankenkassen auf einen Blick – mit offiziellen BAG-Daten.
              </p>
              <a href="#formular" className="btn-accent text-lg px-8 py-4 rounded-2xl inline-block">
                Jetzt Krankenkasse vergleichen!
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
