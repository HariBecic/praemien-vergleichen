import type { Metadata } from "next";
import Link from "next/link";
import { CANTONS, formatCHF } from "@/lib/canton-data";

export const metadata: Metadata = {
  title: "Krankenkassenprämien nach Kanton 2026 – Alle 26 Kantone",
  description:
    "Krankenkassenprämien 2026 in allen 26 Kantonen der Schweiz vergleichen. Von Appenzell Innerrhoden (günstigster) bis Genf (teuerster Kanton). Offizielle BAG-Daten.",
  keywords: [
    "Krankenkassenprämien Kantone",
    "Krankenkasse Schweiz 2026",
    "günstigster Kanton Krankenkasse",
    "Prämienvergleich Kantone",
    "Krankenkassenprämien nach Kanton",
  ],
  alternates: { canonical: "/kanton" },
};

export default function KantoneOverview() {
  const sorted = [...CANTONS].sort((a, b) => a.avgPraemie2026 - b.avgPraemie2026);
  const cheapest = sorted[0];
  const mostExpensive = sorted[sorted.length - 1];
  const avgCH = 393.3;

  return (
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
          <li className="text-white/70">Kantone</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] mb-6">
            Krankenkassenprämien{" "}
            <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
              nach Kanton
            </span>
          </h1>
          <p className="text-lg text-white/60 max-w-2xl leading-relaxed">
            Die Krankenkassenprämien variieren stark zwischen den 26 Kantonen der Schweiz.
            {` ${cheapest.name} ist mit Ø ${formatCHF(cheapest.avgPraemie2026)} der günstigste, ${mostExpensive.name} mit Ø ${formatCHF(mostExpensive.avgPraemie2026)} der teuerste Kanton.`}
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 border-y border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-sm text-white/40">Günstigster Kanton</div>
              <div className="text-xl font-bold text-green-400">{cheapest.name}</div>
              <div className="text-sm text-white/50">{formatCHF(cheapest.avgPraemie2026)}/Mt.</div>
            </div>
            <div>
              <div className="text-sm text-white/40">Schweizer Durchschnitt</div>
              <div className="text-xl font-bold text-white">CHF 393.30</div>
              <div className="text-sm text-white/50">+4.4% vs. 2025</div>
            </div>
            <div>
              <div className="text-sm text-white/40">Teuerster Kanton</div>
              <div className="text-xl font-bold text-red-400">{mostExpensive.name}</div>
              <div className="text-sm text-white/50">{formatCHF(mostExpensive.avgPraemie2026)}/Mt.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Canton List */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold mb-8">Alle 26 Kantone im Überblick</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-white/40">
                  <th className="text-left py-3 font-medium">#</th>
                  <th className="text-left py-3 font-medium">Kanton</th>
                  <th className="text-right py-3 font-medium">Ø Prämie 2026</th>
                  <th className="text-right py-3 font-medium hidden sm:table-cell">Günstigste</th>
                  <th className="text-right py-3 font-medium hidden sm:table-cell">Sparpotenzial/Jahr</th>
                  <th className="text-right py-3 font-medium">Änderung</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((c, i) => {
                  const isAbove = c.avgPraemie2026 > avgCH;
                  return (
                    <tr
                      key={c.slug}
                      className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-3 text-white/30">{i + 1}</td>
                      <td className="py-3">
                        <Link
                          href={`/kanton/${c.slug}`}
                          className="font-semibold text-white hover:text-[#fb923c] transition-colors"
                        >
                          {c.name}
                          <span className="text-white/30 ml-1 text-xs">({c.abbreviation})</span>
                        </Link>
                      </td>
                      <td className={`text-right py-3 font-semibold ${isAbove ? "text-red-400" : "text-green-400"}`}>
                        {formatCHF(c.avgPraemie2026)}
                      </td>
                      <td className="text-right py-3 text-white/60 hidden sm:table-cell">
                        {formatCHF(c.guenstigstePraemie)}
                      </td>
                      <td className="text-right py-3 text-white/60 hidden sm:table-cell">
                        CHF {c.sparpotenzial.toLocaleString("de-CH")}
                      </td>
                      <td className="text-right py-3 text-orange-400">
                        +{c.aenderungProzent}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-white/30 mt-4">
            Quelle: Bundesamt für Gesundheit (BAG), Prämien 2026. Ø Prämie für Erwachsene ab 26 Jahre, Franchise CHF 300, Standard-Modell.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ihre persönliche Prämie berechnen</h2>
          <p className="text-lg text-white/60 mb-8">
            Die günstigste Kasse hängt von Ihrem Wohnort, Alter und Franchise ab.
            Vergleichen Sie jetzt kostenlos.
          </p>
          <a
            href="/#formular"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#e36414] hover:bg-[#d45a10] text-white font-semibold text-lg transition-colors"
          >
            Jetzt vergleichen
          </a>
        </div>
      </section>
    </main>
  );
}
