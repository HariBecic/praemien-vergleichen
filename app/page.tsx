import { PremiumCalculator } from "@/components/PremiumCalculator";
import { Header } from "@/components/Header";

const TESTIMONIALS = [
  {
    name: "Emil B.",
    stars: 5,
    badge: "Local Guide · Level 4",
    text: "Unglaublich, wie einfach das war! In 5 Minuten das Formular ausgefüllt und schon am nächsten Tag hat mich ein Berater angerufen. Wir sparen jetzt als Familie CHF 2'400 pro Jahr. Hätte ich das mal früher gemacht!",
    img: "EB",
  },
  {
    name: "Marco S.",
    stars: 5,
    badge: "Local Guide · Level 5",
    text: "Als Selbstständiger zahle ich alles selber und jeder Franken zählt. Der Vergleich hat mir gezeigt, dass ich CHF 1'800 zu viel bezahle. Nach dem Wechsel bleibt endlich mehr übrig für mein Business!",
    img: "MS",
  },
  {
    name: "Samra Z.",
    stars: 5,
    badge: "2 Rezensionen",
    text: "Ich dachte immer, alle Krankenkassen kosten gleich viel. Was für ein Irrtum! Der Berater war sehr geduldig und hat mir alles erklärt. Jetzt spare ich CHF 960 im Jahr und bekomme sogar bessere Leistungen.",
    img: "SZ",
  },
  {
    name: "Danu S.",
    stars: 5,
    badge: "5 Rezensionen",
    text: "Wir haben für uns und unsere zwei Kinder verglichen. Der Wechsel war problemlos und wir sparen jetzt über CHF 200 pro Monat! Das sind fast CHF 2'500 im Jahr. Kann ich jedem empfehlen, kostet ja nichts.",
    img: "DS",
  },
];

export default function Home() {
  return (
    <>
      <Header />

      <main>
        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0f4c5c] via-[#0a3540] to-[#0f4c5c] text-white">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-28 pb-20 sm:pt-36 sm:pb-28">
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-sm uppercase tracking-widest text-white/60 font-medium mb-4">
                Sag den Krankenkassenprämien den Kampf an!
              </p>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
                Spare bis zu{" "}
                <span className="text-[#fb8b24]">CHF 2&apos;000</span>
              </h1>

              <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
                Kostenloser Vergleich und in nur 2 Minuten. Finden Sie jetzt die
                günstigste Krankenkasse für 2026!
              </p>

              <a
                href="#formular"
                className="btn-accent text-lg px-8 py-4 rounded-2xl"
              >
                Jetzt vergleichen!
              </a>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 48" fill="none" className="w-full">
              <path d="M0 48h1440V16C1200 0 960 32 720 32S240 0 0 16v32z" fill="#fafaf9" />
            </svg>
          </div>
        </section>

        {/* ── Calculator Section ── */}
        <section id="formular" className="py-16 sm:py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <PremiumCalculator />
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className="py-16 sm:py-24 bg-white border-y border-stone-200/60">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid sm:grid-cols-2 gap-6">
              {TESTIMONIALS.map((t) => (
                <div key={t.name} className="card p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-[#0f4c5c]/10 flex items-center justify-center font-bold text-[#0f4c5c] text-sm">
                      {t.img}
                    </div>
                    <div>
                      <div className="font-semibold text-stone-900">{t.name}</div>
                      <div className="text-xs text-stone-400">{t.badge}</div>
                    </div>
                    <div className="ml-auto text-[#fb8b24] text-sm">
                      {"★".repeat(t.stars)}
                    </div>
                  </div>
                  <p className="text-sm text-stone-600 leading-relaxed italic">
                    &ldquo;{t.text}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Benefits ── */}
        <section id="vorteile" className="py-16 sm:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
              Warum lohnt sich ein Prämienvergleich?
            </h2>
            <p className="text-center text-stone-500 mb-12 max-w-2xl mx-auto">
              Die gleichen Leistungen, aber unterschiedliche Preise – nutzen Sie das zu Ihrem Vorteil.
            </p>

            <div className="grid sm:grid-cols-3 gap-8">
              {[
                {
                  title: "Bis zu CHF 2'000 sparen",
                  desc: "Die Prämien-Unterschiede zwischen Krankenkassen können enorm sein. Mit unserem Vergleich finden Sie garantiert ein günstigeres Angebot.",
                  icon: "💰",
                },
                {
                  title: "Nur 2 Minuten Zeitaufwand",
                  desc: "Unser einfacher Fragebogen dauert nur 2 Minuten. Sie erhalten danach eine persönliche Beratung zu den besten Angeboten.",
                  icon: "⏱️",
                },
                {
                  title: "Unabhängig & Kostenlos",
                  desc: "Wir sind komplett unabhängig. Unser Service ist für Sie 100% kostenlos.",
                  icon: "✅",
                },
              ].map((b) => (
                <div key={b.title} className="text-center">
                  <div className="text-4xl mb-4">{b.icon}</div>
                  <h3 className="text-lg font-bold mb-2">{b.title}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section id="wie-es-funktionert" className="py-16 sm:py-24 bg-white border-y border-stone-200/60">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
              In 3 einfachen Schritten zur günstigeren Krankenkasse
            </h2>

            <div className="grid sm:grid-cols-3 gap-8 sm:gap-12">
              {[
                {
                  step: "1",
                  title: "Formular ausfüllen",
                  desc: "Beantworten Sie ein paar kurze Fragen zu Ihrer aktuellen Situation.",
                },
                {
                  step: "2",
                  title: "Angebote erhalten",
                  desc: "Sie erhalten passende Prämien-Angebote von verschiedenen Krankenkassen.",
                },
                {
                  step: "3",
                  title: "Sparen",
                  desc: "Wählen Sie das beste Angebot und sparen Sie ab sofort bei Ihrer Krankenkasse.",
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#e36414] text-white text-xl font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-stone-500 leading-relaxed">{item.desc}</p>
                  <a
                    href="#formular"
                    className="inline-block mt-3 text-sm font-medium text-[#0f4c5c] hover:underline"
                  >
                    Jetzt vergleichen!
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="py-16 sm:py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <p className="text-center text-sm text-stone-400 uppercase tracking-wider mb-2">
              Ihre Fragen beantwortet
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10">
              Häufig gestellte Fragen
            </h2>

            <div className="space-y-3">
              {[
                {
                  q: "Ist der Vergleich wirklich kostenlos?",
                  a: "Ja, unser Service ist 100% kostenlos und unverbindlich. Sie gehen keinerlei Verpflichtungen ein.",
                },
                {
                  q: "Wie viel kann ich wirklich sparen?",
                  a: "Je nach aktueller Krankenkasse und gewählter Franchise können Sie zwischen CHF 500 und CHF 2'000 pro Jahr sparen.",
                },
                {
                  q: "Muss ich meine Krankenkasse wechseln?",
                  a: "Nein, der Vergleich ist unverbindlich. Sie entscheiden selbst, ob Sie wechseln möchten.",
                },
                {
                  q: "Bis wann kann ich meine Krankenkasse wechseln?",
                  a: "Für einen Wechsel per 1. Januar müssen Sie bis spätestens 30. November kündigen.",
                },
                {
                  q: "Erhalte ich danach Spam?",
                  a: "Nein, wir geben Ihre Daten nur an seriöse Versicherungsberater weiter, die Sie einmalig kontaktieren.",
                },
                {
                  q: "Ist meine Grundversicherung überall gleich?",
                  a: "Ja, die Leistungen der Grundversicherung sind gesetzlich vorgeschrieben und bei allen Kassen identisch.",
                },
              ].map((faq) => (
                <details key={faq.q} className="group card p-5 cursor-pointer">
                  <summary className="flex items-center justify-between font-semibold list-none">
                    {faq.q}
                    <svg
                      className="w-5 h-5 text-stone-400 group-open:rotate-180 transition-transform flex-shrink-0"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-3 text-stone-500 leading-relaxed text-sm">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="py-16 sm:py-24 bg-gradient-to-br from-[#0f4c5c] to-[#0a3540] text-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Starten Sie jetzt Ihren kostenlosen Prämienvergleich
            </h2>
            <a href="#formular" className="btn-accent text-lg px-8 py-4 rounded-2xl mt-4 inline-block">
              Jetzt vergleichen!
            </a>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-stone-900 text-stone-400 py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="font-semibold text-white">
              praemien-vergleichen<span className="text-[#e36414]">.ch</span>
            </div>
            <div className="flex gap-6 text-sm">
              <a href="/impressum" className="hover:text-white transition-colors">Impressum</a>
              <a href="/datenschutz" className="hover:text-white transition-colors">Datenschutz</a>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-stone-800 text-xs text-center text-stone-500">
            Copyright © {new Date().getFullYear()} Prämien vergleichen • Alle Angaben ohne Gewähr
          </div>
        </div>
      </footer>
    </>
  );
}
