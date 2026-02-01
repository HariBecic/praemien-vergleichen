import { Metadata } from "next";
import { Header } from "@/components/Header";
import { Logo } from "@/components/Logo";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum von praemien-vergleichen.ch - Ihr unabhängiger Krankenkassenvergleich für die Schweiz.",
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://praemien-vergleichen.ch/impressum",
  },
};

export default function Impressum() {
  return (
    <>
      <Header />

      <main className="pt-28 pb-16 sm:pt-40 sm:pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm text-white/40">
            <Link href="/" className="hover:text-white/60 transition-colors">
              Startseite
            </Link>
            <span className="mx-2">›</span>
            <span className="text-white/60">Impressum</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-bold mb-8">Impressum</h1>

          <div className="prose prose-invert prose-sm max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Kontakt</h2>
              <p className="text-white/60">
                praemien-vergleichen.ch<br />
                Schweiz
              </p>
              <p className="text-white/60 mt-4">
                E-Mail: info@praemien-vergleichen.ch
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Haftungsausschluss</h2>
              <h3 className="text-lg font-medium text-white/80 mb-2">Haftung für Inhalte</h3>
              <p className="text-white/60">
                Die Inhalte unserer Seiten wurden mit grösster Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit
                und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir
                für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Wir sind jedoch
                nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach
                Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
              </p>

              <h3 className="text-lg font-medium text-white/80 mb-2 mt-6">Haftung für Links</h3>
              <p className="text-white/60">
                Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben.
                Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
                verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die
                verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstösse überprüft.
                Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Urheberrecht</h2>
              <p className="text-white/60">
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem
                Schweizer Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung
                ausserhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen
                Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht
                kommerziellen Gebrauch gestattet.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Datenschutz</h2>
              <p className="text-white/60">
                Informationen zum Datenschutz finden Sie in unserer{" "}
                <Link href="/datenschutz" className="text-blue-400 hover:text-blue-300 underline">
                  Datenschutzerklärung
                </Link>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Streitschlichtung</h2>
              <p className="text-white/60">
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Logo size="small" className="text-white/70" />
            <div className="flex gap-6 text-sm">
              <Link href="/impressum" className="text-white/60 hover:text-white transition-colors">
                Impressum
              </Link>
              <Link href="/datenschutz" className="text-white/40 hover:text-white transition-colors">
                Datenschutz
              </Link>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-white/[0.06] text-xs text-center text-white/25">
            Copyright © {new Date().getFullYear()} Prämien vergleichen · Alle Angaben ohne Gewähr
          </div>
        </div>
      </footer>
    </>
  );
}
