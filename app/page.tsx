import { PremiumCalculator } from "@/components/PremiumCalculator";
import { Header } from "@/components/Header";
import { Logo } from "@/components/Logo";

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
        <section className="relative overflow-hidden pt-28 pb-20 sm:pt-40 sm:pb-32">
          {/* Extra glow orb behind hero */}
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-blue-500/[0.06] blur-[100px] pointer-events-none" />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.1] bg-white/[0.04] backdrop-blur-sm text-sm text-white/60 mb-6">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Offizielle BAG-Prämien 2026
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
                Spare bis zu{" "}
                <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
                  CHF 2&apos;000
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
                Kostenloser Vergleich in nur 2 Minuten. Finden Sie jetzt die
                günstigste Krankenkasse für 2026!
              </p>

              <a
                href="#formular"
                className="btn-accent text-lg px-8 py-4 rounded-2xl"
              >
                Jetzt vergleichen!
              </a>

              {/* Stats pills */}
              <div className="flex flex-wrap items-center justify-center gap-4 mt-12">
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
            </div>
          </div>
        </section>

        {/* ── Calculator Section ── */}
        <section id="formular" className="py-16 sm:py-24" style={{ scrollMarginTop: "4rem" }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <PremiumCalculator />
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className="py-16 sm:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <p className="text-center text-sm text-white/40 uppercase tracking-wider mb-2">
              Echte Erfahrungen
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
              Das sagen unsere Kunden
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              {TESTIMONIALS.map((t) => (
                <div key={t.name} className="card p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 rounded-full bg-blue-500/15 border border-blue-500/20 flex items-center justify-center font-bold text-blue-400 text-sm">
                      {t.img}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{t.name}</div>
                      <div className="text-xs text-white/30">{t.badge}</div>
                    </div>
                    <div className="ml-auto text-orange-400 text-sm tracking-wide">
                      {"★".repeat(t.stars)}
                    </div>
                  </div>
                  <p className="text-sm text-white/50 leading-relaxed italic">
                    &ldquo;{t.text}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Benefits ── */}
        <section id="vorteile" style={{ scrollMarginTop: "4rem" }} className="py-16 sm:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
              Warum lohnt sich ein Prämienvergleich?
            </h2>
            <p className="text-center text-white/50 mb-12 max-w-2xl mx-auto">
              Die gleichen Leistungen, aber unterschiedliche Preise – nutzen Sie das zu Ihrem Vorteil.
            </p>

            <div className="grid sm:grid-cols-3 gap-6">
              {[
                {
                  title: "Bis zu CHF 2'000 sparen",
                  desc: "Die Prämien-Unterschiede zwischen Krankenkassen können enorm sein. Mit unserem Vergleich finden Sie garantiert ein günstigeres Angebot.",
                  icon: (
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                    </svg>
                  ),
                  color: "from-green-400 to-emerald-500",
                  glow: "bg-green-500/10",
                },
                {
                  title: "Nur 2 Minuten Zeitaufwand",
                  desc: "Unser einfacher Fragebogen dauert nur 2 Minuten. Sie erhalten danach eine persönliche Beratung zu den besten Angeboten.",
                  icon: (
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  color: "from-blue-400 to-indigo-500",
                  glow: "bg-blue-500/10",
                },
                {
                  title: "Unabhängig & Kostenlos",
                  desc: "Wir sind komplett unabhängig. Unser Service ist für Sie 100% kostenlos.",
                  icon: (
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                    </svg>
                  ),
                  color: "from-orange-400 to-amber-500",
                  glow: "bg-orange-500/10",
                },
              ].map((b) => (
                <div key={b.title} className="card p-6 text-center group">
                  <div className={`w-14 h-14 rounded-2xl ${b.glow} flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110`}>
                    <div className={`bg-gradient-to-br ${b.color} bg-clip-text text-transparent`}>
                      {b.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-white">{b.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section id="wie-es-funktionert" style={{ scrollMarginTop: "4rem" }} className="py-16 sm:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
              In 3 einfachen Schritten zur günstigeren Krankenkasse
            </h2>

            <div className="grid sm:grid-cols-3 gap-8 sm:gap-6">
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
                <div key={item.step} className="card p-6 text-center relative">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white text-lg font-bold mb-4 shadow-lg shadow-orange-500/20">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">{item.title}</h3>
                  <p className="text-white/50 leading-relaxed text-sm">{item.desc}</p>
                  <a
                    href="#formular"
                    className="inline-block mt-4 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Jetzt vergleichen →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" style={{ scrollMarginTop: "4rem" }} className="py-16 sm:py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <p className="text-center text-sm text-white/40 uppercase tracking-wider mb-2">
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
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="py-16 sm:py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="card-elevated p-10 sm:p-14 text-center relative overflow-hidden">
              {/* Glow accent */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Starten Sie jetzt Ihren kostenlosen Prämienvergleich
              </h2>
              <p className="text-white/50 mb-8 max-w-lg mx-auto">
                Über 217&apos;000 Tarife von 27 Schweizer Versicherern auf einen Blick.
              </p>
              <a href="#formular" className="btn-accent text-lg px-8 py-4 rounded-2xl inline-block">
                Jetzt vergleichen!
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.06] py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Logo size="small" className="text-white/70" />
            <div className="flex gap-6 text-sm">
              <a href="/impressum" className="text-white/40 hover:text-white transition-colors">Impressum</a>
              <a href="/datenschutz" className="text-white/40 hover:text-white transition-colors">Datenschutz</a>
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
