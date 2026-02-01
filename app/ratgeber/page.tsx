import type { Metadata } from "next";
import Link from "next/link";
import { ALL_RATGEBER_ARTICLES } from "@/lib/ratgeber-data";

export const metadata: Metadata = {
  title: "Ratgeber Krankenkasse Schweiz 2026 – Tipps & Anleitungen",
  description:
    "Ratgeber rund um die Krankenkasse in der Schweiz: Wechsel-Anleitung, Franchise-Vergleich, Versicherungsmodelle, Prämienverbilligung und mehr.",
  keywords: [
    "Krankenkasse Ratgeber",
    "Krankenkasse Schweiz Tipps",
    "Krankenkasse wechseln Anleitung",
    "Franchise Tipps",
  ],
  alternates: { canonical: "/ratgeber" },
};

export default function RatgeberOverview() {
  return (
    <main className="min-h-screen bg-[#0a0f1a] text-white">
      <nav className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-4">
        <ol className="flex items-center gap-2 text-sm text-white/40">
          <li>
            <Link href="/" className="hover:text-white/70 transition-colors">
              Startseite
            </Link>
          </li>
          <li>/</li>
          <li className="text-white/70">Ratgeber</li>
        </ol>
      </nav>

      <section className="pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] mb-6">
            Krankenkassen-
            <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
              Ratgeber
            </span>
          </h1>
          <p className="text-lg text-white/60 max-w-2xl leading-relaxed">
            Alles was Sie über die Krankenkasse in der Schweiz wissen müssen –
            verständlich erklärt und auf dem neusten Stand 2026.
          </p>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="space-y-4">
            {ALL_RATGEBER_ARTICLES.map((article) => (
              <Link
                key={article.slug}
                href={`/ratgeber/${article.slug}`}
                className="block p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-[#e36414]/30 hover:bg-white/[0.05] transition-all group"
              >
                <h2 className="text-lg font-bold text-white group-hover:text-[#fb923c] transition-colors mb-2">
                  {article.title}
                </h2>
                <p className="text-sm text-white/50 mb-3">{article.metaDescription}</p>
                <div className="flex items-center gap-3 text-xs text-white/30">
                  <span>📖 {article.readingTime}</span>
                  <span>·</span>
                  <span>{article.sections.length} Abschnitte</span>
                  <span>·</span>
                  <span>{article.faqItems.length} FAQ</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <a
            href="/#formular"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#e36414] hover:bg-[#d45a10] text-white font-semibold text-lg transition-colors"
          >
            Direkt zum Prämienrechner
          </a>
        </div>
      </section>
    </main>
  );
}
