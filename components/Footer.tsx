import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-10 bg-[#0a0f1a]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Logo size="small" className="text-white/70 mb-4" />
            <p className="text-sm text-white/40 leading-relaxed">
              Der unabhängige Krankenkassenvergleich für die Schweiz. Offizielle BAG-Daten 2026.
            </p>
          </div>

          {/* Kantone */}
          <div>
            <h4 className="font-semibold text-white mb-4">Beliebte Kantone</h4>
            <ul className="space-y-2">
              {[
                { href: "/kanton/zuerich", label: "Zürich" },
                { href: "/kanton/bern", label: "Bern" },
                { href: "/kanton/basel-stadt", label: "Basel-Stadt" },
                { href: "/kanton/genf", label: "Genf" },
                { href: "/kanton", label: "Alle Kantone →" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/40 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ratgeber */}
          <div>
            <h4 className="font-semibold text-white mb-4">Ratgeber</h4>
            <ul className="space-y-2">
              {[
                { href: "/ratgeber/krankenkasse-wechseln", label: "Krankenkasse wechseln" },
                { href: "/ratgeber/franchise-waehlen", label: "Franchise wählen" },
                { href: "/ratgeber/versicherungsmodelle", label: "Versicherungsmodelle" },
                { href: "/ratgeber/praemienverbilligung", label: "Prämienverbilligung" },
                { href: "/ratgeber", label: "Alle Ratgeber →" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/40 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold text-white mb-4">Informationen</h4>
            <ul className="space-y-2">
              {[
                { href: "/#faq", label: "FAQ" },
                { href: "/#vorteile", label: "Vorteile" },
                { href: "/impressum", label: "Impressum" },
                { href: "/datenschutz", label: "Datenschutz" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/40 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-white/25">
            © {new Date().getFullYear()} praemien-vergleichen.ch · Alle Angaben ohne Gewähr
          </div>
          <div className="flex items-center gap-4 text-xs text-white/25">
            <span>Datenquelle: Bundesamt für Gesundheit (BAG)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
