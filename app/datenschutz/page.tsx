import { Metadata } from "next";
import { Header } from "@/components/Header";
import { Logo } from "@/components/Logo";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: "Datenschutzerklärung von praemien-vergleichen.ch - Informationen zum Schutz Ihrer persönlichen Daten beim Krankenkassenvergleich.",
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://praemien-vergleichen.ch/datenschutz",
  },
};

export default function Datenschutz() {
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
            <span className="text-white/60">Datenschutz</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-bold mb-8">Datenschutzerklärung</h1>

          <div className="prose prose-invert prose-sm max-w-none space-y-8 text-white/60">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">1. Datenschutz auf einen Blick</h2>

              <h3 className="text-lg font-medium text-white/80 mb-2">Allgemeine Hinweise</h3>
              <p>
                Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen
                Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit
                denen Sie persönlich identifiziert werden können.
              </p>

              <h3 className="text-lg font-medium text-white/80 mb-2 mt-6">Datenerfassung auf dieser Website</h3>
              <p>
                <strong className="text-white/80">Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong><br />
                Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten
                können Sie dem{" "}
                <Link href="/impressum" className="text-blue-400 hover:text-blue-300 underline">
                  Impressum
                </Link>{" "}
                dieser Website entnehmen.
              </p>

              <p className="mt-4">
                <strong className="text-white/80">Wie erfassen wir Ihre Daten?</strong><br />
                Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich
                z.B. um Daten handeln, die Sie in unser Kontaktformular eingeben.
              </p>

              <p className="mt-4">
                Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere
                IT-Systeme erfasst. Das sind vor allem technische Daten (z.B. Internetbrowser, Betriebssystem oder
                Uhrzeit des Seitenaufrufs).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">2. Hosting</h2>
              <p>
                Wir hosten die Inhalte unserer Website bei folgendem Anbieter: Diese Website wird auf Servern
                gehostet, die den höchsten Sicherheitsstandards entsprechen. Die Server befinden sich in der
                Schweiz oder im EWR-Raum und unterliegen den entsprechenden Datenschutzgesetzen.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">3. Allgemeine Hinweise und Pflichtinformationen</h2>

              <h3 className="text-lg font-medium text-white/80 mb-2">Datenschutz</h3>
              <p>
                Der Schutz Ihrer persönlichen Daten ist uns ein besonderes Anliegen. Wir behandeln Ihre
                personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften
                sowie dieser Datenschutzerklärung.
              </p>

              <p className="mt-4">
                Wir weisen darauf hin, dass die Datenübertragung im Internet (z.B. bei der Kommunikation per E-Mail)
                Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte
                ist nicht möglich.
              </p>

              <h3 className="text-lg font-medium text-white/80 mb-2 mt-6">SSL- bzw. TLS-Verschlüsselung</h3>
              <p>
                Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte,
                wie zum Beispiel Anfragen, die Sie an uns als Seitenbetreiber senden, eine SSL- bzw. TLS-Verschlüsselung.
                Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von „http://"
                auf „https://" wechselt und an dem Schloss-Symbol in Ihrer Browserzeile.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">4. Datenerfassung auf dieser Website</h2>

              <h3 className="text-lg font-medium text-white/80 mb-2">Kontaktformular</h3>
              <p>
                Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem
                Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der
                Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht
                ohne Ihre Einwilligung weiter.
              </p>

              <p className="mt-4">
                Die Verarbeitung dieser Daten erfolgt auf Grundlage Ihrer Einwilligung. Sie können diese
                Einwilligung jederzeit widerrufen. Die Rechtmässigkeit der bis zum Widerruf erfolgten
                Datenverarbeitungsvorgänge bleibt vom Widerruf unberührt.
              </p>

              <h3 className="text-lg font-medium text-white/80 mb-2 mt-6">Prämienvergleich-Formular</h3>
              <p>
                Wenn Sie unser Prämienvergleich-Formular nutzen, werden die von Ihnen eingegebenen Daten
                (wie PLZ, Geburtsdatum, Kontaktdaten) verarbeitet, um Ihnen passende Krankenkassenangebote
                zu vermitteln. Diese Daten werden an ausgewählte, seriöse Versicherungspartner weitergeleitet,
                die Sie kontaktieren werden.
              </p>

              <p className="mt-4">
                Mit dem Absenden des Formulars erklären Sie sich mit dieser Datenverarbeitung einverstanden.
                Ihre Daten werden ausschliesslich für den Zweck der Vermittlung von Krankenkassenangeboten verwendet.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">5. Analyse-Tools und Werbung</h2>

              <h3 className="text-lg font-medium text-white/80 mb-2">Meta-Pixel (Facebook Pixel)</h3>
              <p>
                Diese Website nutzt zur Konversionsmessung das Besucheraktions-Pixel von Meta (Facebook). Anbieter
                dieses Dienstes ist die Meta Platforms Ireland Limited, 4 Grand Canal Square, Dublin 2, Irland.
              </p>

              <p className="mt-4">
                So kann das Verhalten der Seitenbesucher nachverfolgt werden, nachdem diese durch Klick auf eine
                Meta-Werbeanzeige auf die Website des Anbieters weitergeleitet wurden. Dadurch können die Wirksamkeit
                der Meta-Werbeanzeigen für statistische und Marktforschungszwecke ausgewertet werden.
              </p>

              <p className="mt-4">
                Die erhobenen Daten sind für uns anonym, bieten uns also keine Rückschlüsse auf die Identität der
                Nutzer. Die Daten werden aber von Meta gespeichert und verarbeitet, sodass eine Verbindung zum
                jeweiligen Nutzerprofil möglich ist. Meta kann die Daten für eigene Werbezwecke, entsprechend der
                Meta-Datenrichtlinie, verwenden.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">6. Ihre Rechte</h2>
              <p>
                Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer
                gespeicherten personenbezogenen Daten zu erhalten. Sie haben ausserdem ein Recht, die Berichtigung
                oder Löschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt
                haben, können Sie diese Einwilligung jederzeit für die Zukunft widerrufen. Ausserdem haben Sie das
                Recht, unter bestimmten Umständen die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten
                zu verlangen.
              </p>

              <p className="mt-4">
                Des Weiteren steht Ihnen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.
              </p>

              <p className="mt-4">
                Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit an uns wenden.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">7. Aktualität und Änderung dieser Datenschutzerklärung</h2>
              <p>
                Diese Datenschutzerklärung ist aktuell gültig und hat den Stand Januar 2026.
              </p>

              <p className="mt-4">
                Durch die Weiterentwicklung unserer Website und Angebote darüber oder aufgrund geänderter
                gesetzlicher beziehungsweise behördlicher Vorgaben kann es notwendig werden, diese
                Datenschutzerklärung zu ändern.
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
              <Link href="/impressum" className="text-white/40 hover:text-white transition-colors">
                Impressum
              </Link>
              <Link href="/datenschutz" className="text-white/60 hover:text-white transition-colors">
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
