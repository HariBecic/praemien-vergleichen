import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  RATGEBER_ARTICLES,
  getRatgeberBySlug,
  getAllRatgeberSlugs,
} from "@/lib/ratgeber-data";

export function generateStaticParams() {
  return getAllRatgeberSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getRatgeberBySlug(slug);
  if (!article) return {};

  return {
    title: article.metaTitle,
    description: article.metaDescription,
    keywords: article.keywords,
    alternates: { canonical: `/ratgeber/${article.slug}` },
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      type: "article",
      url: `/ratgeber/${article.slug}`,
    },
  };
}

export default async function RatgeberPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getRatgeberBySlug(slug);
  if (!article) notFound();

  const otherArticles = RATGEBER_ARTICLES.filter((a) => a.slug !== article.slug);

  // JSON-LD
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription,
    dateModified: article.lastUpdated,
    author: {
      "@type": "Organization",
      name: "praemien-vergleichen.ch",
    },
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
        name: "Ratgeber",
        item: "https://praemien-vergleichen.ch/ratgeber",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: `https://praemien-vergleichen.ch/ratgeber/${article.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="min-h-screen bg-[#0a0f1a] text-white">
        {/* Breadcrumb */}
        <nav className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-4">
          <ol className="flex items-center gap-2 text-sm text-white/40">
            <li>
              <Link href="/" className="hover:text-white/70 transition-colors">
                Startseite
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/ratgeber" className="hover:text-white/70 transition-colors">
                Ratgeber
              </Link>
            </li>
            <li>/</li>
            <li className="text-white/70 truncate max-w-[200px]">{article.title.split("–")[0].trim()}</li>
          </ol>
        </nav>

        {/* Article Header */}
        <header className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
          <div className="flex items-center gap-4 text-sm text-white/40 mb-4">
            <span>📖 {article.readingTime} Lesezeit</span>
            <span>·</span>
            <span>Aktualisiert: {new Date(article.lastUpdated).toLocaleDateString("de-CH")}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-4">
            {article.title}
          </h1>
          <p className="text-lg text-white/60 leading-relaxed">
            {article.heroSubtitle}
          </p>
        </header>

        {/* Table of Contents */}
        <nav className="max-w-3xl mx-auto px-4 sm:px-6 mb-12">
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <div className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">
              Inhalt
            </div>
            <ol className="space-y-2">
              {article.sections.map((section, i) => (
                <li key={i}>
                  <a
                    href={`#section-${i}`}
                    className="text-white/60 hover:text-[#fb923c] transition-colors text-sm"
                  >
                    {i + 1}. {section.heading}
                  </a>
                </li>
              ))}
              {article.faqItems.length > 0 && (
                <li>
                  <a
                    href="#faq"
                    className="text-white/60 hover:text-[#fb923c] transition-colors text-sm"
                  >
                    {article.sections.length + 1}. Häufige Fragen
                  </a>
                </li>
              )}
            </ol>
          </div>
        </nav>

        {/* Article Content */}
        <article className="max-w-3xl mx-auto px-4 sm:px-6">
          {article.sections.map((section, i) => (
            <section key={i} id={`section-${i}`} className="mb-12 scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-bold mb-4">{section.heading}</h2>
              <div className="text-white/60 leading-relaxed whitespace-pre-line text-[15px]">
                {section.content}
              </div>
              {section.tip && (
                <div className="mt-4 p-4 rounded-xl bg-[#e36414]/10 border border-[#e36414]/20">
                  <div className="text-sm font-semibold text-[#fb923c] mb-1">💡 Tipp</div>
                  <p className="text-white/70 text-sm">{section.tip}</p>
                </div>
              )}
            </section>
          ))}
        </article>

        {/* FAQ */}
        {article.faqItems.length > 0 && (
          <section id="faq" className="max-w-3xl mx-auto px-4 sm:px-6 py-12 scroll-mt-24 border-t border-white/[0.06]">
            <h2 className="text-2xl font-bold mb-6">Häufige Fragen</h2>
            <div className="space-y-4">
              {article.faqItems.map((item, i) => (
                <details
                  key={i}
                  className="group p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]"
                >
                  <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-white">
                    {item.q}
                    <svg
                      className="w-5 h-5 text-white/40 transition-transform group-open:rotate-180 flex-shrink-0 ml-4"
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
          </section>
        )}

        {/* CTA */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <div className="p-8 rounded-2xl bg-gradient-to-r from-[#e36414]/10 to-[#e36414]/5 border border-[#e36414]/20 text-center">
            <h3 className="text-2xl font-bold mb-3">Jetzt Prämien vergleichen</h3>
            <p className="text-white/60 mb-6">
              Kostenlos, unverbindlich und mit offiziellen BAG-Daten 2026.
            </p>
            <a
              href="/#formular"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#e36414] hover:bg-[#d45a10] text-white font-semibold transition-colors"
            >
              Zum Prämienrechner
            </a>
          </div>
        </section>

        {/* Related Articles */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12 border-t border-white/[0.06]">
          <h2 className="text-xl font-bold mb-6">Weitere Ratgeber</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {otherArticles.map((a) => (
              <Link
                key={a.slug}
                href={`/ratgeber/${a.slug}`}
                className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-[#e36414]/30 hover:bg-white/[0.05] transition-all group"
              >
                <span className="text-white group-hover:text-[#fb923c] transition-colors font-medium text-sm">
                  {a.title.split("–")[0].trim()}
                </span>
                <span className="block text-xs text-white/30 mt-1">
                  {a.readingTime} · {a.sections.length} Abschnitte
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Canton Links */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12 border-t border-white/[0.06]">
          <h2 className="text-xl font-bold mb-4">Prämien nach Kanton</h2>
          <p className="text-white/50 text-sm mb-4">
            Detaillierte Prämienvergleiche für alle 26 Kantone:
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "Zürich", "Bern", "Luzern", "Basel-Stadt", "St. Gallen",
              "Aargau", "Genf", "Waadt", "Tessin",
            ].map((name) => {
              const slugMap: Record<string, string> = {
                "Zürich": "zuerich", "Bern": "bern", "Luzern": "luzern",
                "Basel-Stadt": "basel-stadt", "St. Gallen": "st-gallen",
                "Aargau": "aargau", "Genf": "genf", "Waadt": "waadt",
                "Tessin": "tessin",
              };
              return (
                <Link
                  key={name}
                  href={`/kanton/${slugMap[name]}`}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white/50 hover:text-[#fb923c] hover:border-[#e36414]/30 transition-all"
                >
                  {name}
                </Link>
              );
            })}
            <Link
              href="/kanton"
              className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-[#fb923c] hover:bg-[#e36414]/10 transition-all"
            >
              Alle Kantone →
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
