"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Logo } from "./Logo";

const RATGEBER_LINKS = [
  { href: "/ratgeber/krankenkasse-wechseln", label: "Krankenkasse wechseln" },
  { href: "/ratgeber/franchise-waehlen", label: "Franchise wählen" },
  { href: "/ratgeber/versicherungsmodelle", label: "Versicherungsmodelle" },
  { href: "/ratgeber/praemienverbilligung", label: "Prämienverbilligung" },
  { href: "/ratgeber/grundversicherung-leistungen", label: "Grundversicherung" },
  { href: "/ratgeber/zusatzversicherung", label: "Zusatzversicherung" },
];

const KANTON_LINKS = [
  { href: "/kanton/zuerich", label: "Zürich" },
  { href: "/kanton/bern", label: "Bern" },
  { href: "/kanton/basel-stadt", label: "Basel-Stadt" },
  { href: "/kanton/genf", label: "Genf" },
  { href: "/kanton/waadt", label: "Waadt" },
  { href: "/kanton/aargau", label: "Aargau" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0a1128]/80 backdrop-blur-xl border-b border-white/[0.06] shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/">
          <Logo size="small" className="text-white" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" ref={dropdownRef}>
          {/* Kantone Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(dropdownOpen === "kantone" ? null : "kantone")}
              className="flex items-center gap-1 text-sm font-medium text-white/60 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/[0.05]"
            >
              Kantone
              <svg className={`w-4 h-4 transition-transform ${dropdownOpen === "kantone" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {dropdownOpen === "kantone" && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-[#0a1128]/95 backdrop-blur-xl border border-white/[0.1] rounded-xl shadow-xl py-2 animate-fade-in">
                <Link
                  href="/kanton"
                  className="block px-4 py-2 text-sm text-orange-400 hover:bg-white/[0.05] font-semibold"
                  onClick={() => setDropdownOpen(null)}
                >
                  Alle 26 Kantone →
                </Link>
                <div className="border-t border-white/[0.06] my-2" />
                {KANTON_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/[0.05]"
                    onClick={() => setDropdownOpen(null)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Ratgeber Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(dropdownOpen === "ratgeber" ? null : "ratgeber")}
              className="flex items-center gap-1 text-sm font-medium text-white/60 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/[0.05]"
            >
              Ratgeber
              <svg className={`w-4 h-4 transition-transform ${dropdownOpen === "ratgeber" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {dropdownOpen === "ratgeber" && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-[#0a1128]/95 backdrop-blur-xl border border-white/[0.1] rounded-xl shadow-xl py-2 animate-fade-in">
                <Link
                  href="/ratgeber"
                  className="block px-4 py-2 text-sm text-orange-400 hover:bg-white/[0.05] font-semibold"
                  onClick={() => setDropdownOpen(null)}
                >
                  Alle Ratgeber-Artikel →
                </Link>
                <div className="border-t border-white/[0.06] my-2" />
                {RATGEBER_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/[0.05]"
                    onClick={() => setDropdownOpen(null)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/#faq" className="text-sm font-medium text-white/60 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/[0.05]">
            FAQ
          </Link>

          <Link
            href="/#formular"
            className="text-sm font-semibold px-5 py-2 rounded-lg transition-all bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 ml-2"
          >
            Jetzt vergleichen
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-white"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/[0.06] bg-[#0a1128]/95 backdrop-blur-xl animate-fade-in max-h-[80vh] overflow-y-auto">
          <nav className="flex flex-col p-4 gap-1">
            {/* Kantone Section */}
            <div className="py-2">
              <div className="text-xs text-white/40 uppercase tracking-wider mb-2 px-2">Kantone</div>
              <Link
                href="/kanton"
                onClick={() => setMenuOpen(false)}
                className="block px-2 py-2 text-orange-400 font-semibold hover:bg-white/[0.05] rounded-lg"
              >
                Alle 26 Kantone
              </Link>
              <div className="grid grid-cols-2 gap-1">
                {KANTON_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="px-2 py-2 text-sm text-white/70 hover:text-white hover:bg-white/[0.05] rounded-lg"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-white/[0.06] my-2" />

            {/* Ratgeber Section */}
            <div className="py-2">
              <div className="text-xs text-white/40 uppercase tracking-wider mb-2 px-2">Ratgeber</div>
              <Link
                href="/ratgeber"
                onClick={() => setMenuOpen(false)}
                className="block px-2 py-2 text-orange-400 font-semibold hover:bg-white/[0.05] rounded-lg"
              >
                Alle Ratgeber-Artikel
              </Link>
              {RATGEBER_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-2 py-2 text-sm text-white/70 hover:text-white hover:bg-white/[0.05] rounded-lg"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="border-t border-white/[0.06] my-2" />

            <Link
              href="/#faq"
              onClick={() => setMenuOpen(false)}
              className="px-2 py-2 text-white/70 font-medium hover:text-white hover:bg-white/[0.05] rounded-lg"
            >
              FAQ
            </Link>

            <Link
              href="/#formular"
              onClick={() => setMenuOpen(false)}
              className="btn-accent text-center py-3 rounded-xl mt-2"
            >
              Jetzt vergleichen
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
