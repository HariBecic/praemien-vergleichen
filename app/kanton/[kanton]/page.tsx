import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CANTONS, getCantonBySlug, getAllCantonSlugs, formatCHF } from "@/lib/canton-data";

// Generate all 26 canton pages at build time
export function generateStaticParams() {
  return getAllCantonSlugs().map((kanton) => ({ kanton }));
}

// Dynamic metadata per canton
export async function generateMetadata({
  params,
}: {
  params: Promise<{ kanton: string }>;
}): Promise<Metadata> {
  const { kanton } = await params;
  const canton = getCantonBySlug(kanton);
  if (!canton) return {};

  return {
    title: canton.metaTitle,
    description: canton.metaDescription,
    keywords: [
      `Krankenkasse ${canton.name}`,
      `Krankenkasse ${canton.name} 2026`,
      `günstigste Krankenkasse ${canton.name}`,
      `Krankenkassenprämien ${canton.name}`,
      `Krankenkasse wechseln ${canton.name}`,
      `Prämienvergleich ${canton.name}`,
      `Grundversicherung ${canton.name} 2026`,
    ],
    alternates: {
      canonical: `/kanton/${canton.slug}`,
    },
    openGraph: {
      title: canton.metaTitle,
      description: canton.metaDescription,
      type: "website",
      url: `/kanton/${canton.slug}`,
    },
  };
}

export default async function CantonPage({
  params,
}: {
  params: Promise<{ kanton: string }>;
}) {
  const { kanton } = await params;
  const canton = getCantonBySlug(kanton);
  if (!canton) notFound();

  const otherCantons = CANTONS.filter((c) => c.slug !== canton.slug);
  const nachbarKantone = otherCantons.slice(0, 6); // Show 6 related cantons

  // JSON-LD Structured Data
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: canton.faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Startseite",
        item: "https://praemien-vergleichen.ch",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Kantone",
        item: "https://praemien-vergleichen.ch/kanton",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `Krankenkasse ${canton.name}`,
        item: `https://praemien-vergleichen.ch/kanton/${canton.slug}`,
      },
    ],
  };

  const colors = {
    primary: "#0a2540",
    accent: "#e36414",
    accentLight: "#fb923c",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="min-h-screen bg-[#0a0f1a] text-white">
        {/* Breadcrumb */}
        <nav className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-4">
          <ol className="flex items-center gap-2 text-sm text-white/40">
            <li>
              <Link href="/" className="hover:text-white/70 transition-colors">
                Startseite
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/kanton" className="hover:text-white/70 transition-colors">
                Kantone
              </Link>
            </li>
            <li>/</li>
            <li className="text-white/70">{canton.name}</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden pb-16">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-blue-500/[0.06] blur-[100px] pointer-events-none" />
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.1] bg-white/[0.04] backdrop-blur-sm text-sm text-white/60 mb-6">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Offizielle BAG-Daten 2026 · Kanton {canton.abbreviation}
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] mb-6">
                {canton.heroTitle.split(" ").slice(0, -1).join(" ")}{" "}
                <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
                  {canton.heroTitle.split(" ").pop()}
                </span>
              </h1>

              <p className="text-lg text-white/60 mb-8 leading-relaxed">
                {canton.heroSubtitle}
              </p>

              <a
                href="/#formular"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#e36414] hover:bg-[#d45a10] text-white font-semibold text-lg transition-colors"
              >
                Jetzt Prämien vergleichen
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* Key Stats */}
        <section className="py-12 border-t border-white/[0.06]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { label: "Ø Prämie 2026", value: formatCHF(canton.avgPraemie2026), sub: "/Monat" },
                { label: "Günstigste", value: formatCHF(canton.guenstigstePraemie), sub: canton.guenstigsteKasse },
                { label: "Sparpotenzial", value: `CHF ${canton.sparpotenzial.toLocaleString("de-CH")}`, sub: "/Jahr" },
                { label: "Prämienänderung", value: `+${canton.aenderungProzent}%`, sub: "vs. 2025" },
              ].map((stat) => (
                <div key={stat.label} className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="text-sm text-white/40 mb-1">{stat.label}</div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-white/30 mt-1">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Intro Content */}
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">
              Krankenkassenprämien im {canton.nameDE}
            </h2>
            <p className="text-white/60 leading-relaxed text-lg mb-8">
              {canton.introText}
            </p>

            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] mb-8">
              <h3 className="font-semibold text-white mb-4">Wissenswertes über {canton.name}</h3>
              <ul className="space-y-3">
                {canton.besonderheiten.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-white/60">
                    <span className="text-green-400 mt-1">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick comparison table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 text-white/40 font-medium">Kennzahl</th>
                    <th className="text-right py-3 text-white/40 font-medium">{canton.name}</th>
                    <th className="text-right py-3 text-white/40 font-medium">CH-Ø</th>
                  </tr>
                </thead>
                <tbody className="text-white/70">
                  <tr className="border-b border-white/[0.04]">
                    <td className="py-3">Ø Prämie Erwachsene</td>
                    <td className="text-right font-semibold text-white">{formatCHF(canton.avgPraemie2026)}</td>
                    <td className="text-right">CHF 393.30</td>
                  </tr>
                  <tr className="border-b border-white/[0.04]">
                    <td className="py-3">Günstigste Prämie</td>
                    <td className="text-right font-semibold text-white">{formatCHF(canton.guenstigstePraemie)}</td>
                    <td className="text-right">—</td>
                  </tr>
                  <tr className="border-b border-white/[0.04]">
                    <td className="py-3">Teuerste Prämie</td>
                    <td className="text-right font-semibold text-white">{formatCHF(canton.teuerstePraemie)}</td>
                    <td className="text-right">—</td>
                  </tr>
                  <tr className="border-b border-white/[0.04]">
                    <td className="py-3">Prämienänderung</td>
                    <td className="text-right font-semibold text-orange-400">+{canton.aenderungProzent}%</td>
                    <td className="text-right">+4.4%</td>
                  </tr>
                  <tr className="border-b border-white/[0.04]">
                    <td className="py-3">Prämienregionen</td>
                    <td className="text-right font-semibold text-white">{canton.praemienregionen}</td>
                    <td className="text-right">—</td>
                  </tr>
                  <tr>
                    <td className="py-3">Einwohner</td>
                    <td className="text-right font-semibold text-white">{canton.einwohner}</td>
                    <td className="text-right">—</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Top Versicherer */}
        <section className="py-16 border-t border-white/[0.06]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">
              Günstigste Krankenkassen in {canton.name} 2026
            </h2>
            <p className="text-white/60 mb-8">
              Diese Versicherer gehören im {canton.nameDE} regelmässig zu den günstigsten Anbietern
              in der Grundversicherung. Die genaue Rangfolge hängt von Ihrer Prämienregion, Ihrem Alter
              und der gewählten Franchise ab.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {canton.topVersicherer.map((name) => (
                <div
                  key={name}
                  className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center"
                >
                  <div className="font-semibold text-white">{name}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-[#e36414]/10 to-[#e36414]/5 border border-[#e36414]/20">
              <p className="text-white/80 text-center">
                <strong>Jetzt Ihre persönliche Prämie berechnen:</strong> Die günstigste Kasse hängt
                von Ihrem Wohnort, Alter und gewünschtem Versicherungsmodell ab.
              </p>
              <div className="text-center mt-4">
                <a
                  href="/#formular"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#e36414] hover:bg-[#d45a10] text-white font-semibold transition-colors"
                >
                  Persönlichen Vergleich starten
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        {canton.faqItems.length > 0 && (
          <section className="py-16 border-t border-white/[0.06]">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
              <h2 className="text-2xl sm:text-3xl font-bold mb-8">
                Häufige Fragen zur Krankenkasse in {canton.name}
              </h2>
              <div className="space-y-4">
                {canton.faqItems.map((item, i) => (
                  <details
                    key={i}
                    className="group p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]"
                  >
                    <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-white">
                      {item.q}
                      <svg
                        className="w-5 h-5 text-white/40 transition-transform group-open:rotate-180"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <p className="mt-3 text-white/60 leading-relaxed">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Ratgeber Links */}
        <section className="py-16 border-t border-white/[0.06]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold mb-6">Nützliche Ratgeber</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { title: "Krankenkasse wechseln – Anleitung & Fristen", slug: "krankenkasse-wechseln" },
                { title: "Franchise wählen – welche passt zu mir?", slug: "franchise-waehlen" },
                { title: "Hausarztmodell, HMO oder Telmed?", slug: "versicherungsmodelle" },
                { title: "Prämienverbilligung beantragen", slug: "praemienverbilligung" },
              ].map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/ratgeber/${guide.slug}`}
                  className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-[#e36414]/30 hover:bg-white/[0.05] transition-all group"
                >
                  <span className="text-white group-hover:text-[#fb923c] transition-colors font-medium">
                    {guide.title}
                  </span>
                  <span className="block text-xs text-white/30 mt-1">Ratgeber lesen →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Other Cantons (Internal Linking) */}
        <section className="py-16 border-t border-white/[0.06]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold mb-6">Weitere Kantone vergleichen</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {otherCantons.map((c) => (
                <Link
                  key={c.slug}
                  href={`/kanton/${c.slug}`}
                  className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-[#e36414]/30 hover:bg-white/[0.05] transition-all group"
                >
                  <div className="font-semibold text-white group-hover:text-[#fb923c] transition-colors">
                    {c.name}
                  </div>
                  <div className="text-xs text-white/30 mt-1">
                    ab {formatCHF(c.guenstigstePraemie)}/Mt.
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 border-t border-white/[0.06]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Jetzt Krankenkasse in {canton.name} vergleichen
            </h2>
            <p className="text-lg text-white/60 mb-8">
              Kostenlos, unverbindlich und mit offiziellen BAG-Daten 2026.
              Sparen Sie bis zu {formatCHF(canton.sparpotenzial)} pro Jahr.
            </p>
            <a
              href="/#formular"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#e36414] hover:bg-[#d45a10] text-white font-semibold text-lg transition-colors"
            >
              Kostenlos vergleichen
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
