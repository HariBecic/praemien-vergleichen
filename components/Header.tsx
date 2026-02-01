"use client";

import { useState, useEffect } from "react";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkClass = (scrolled: boolean) =>
    `text-sm font-medium transition-colors ${
      scrolled ? "text-stone-600 hover:text-stone-900" : "text-white/80 hover:text-white"
    }`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-200/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <a
          href="/"
          className={`font-bold text-lg transition-colors ${
            scrolled ? "text-stone-900" : "text-white"
          }`}
        >
          praemien-vergleichen<span className="text-[#e36414]">.ch</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-6">
          <a href="#wie-es-funktionert" className={linkClass(scrolled)}>Wie es funktioniert</a>
          <a href="#vorteile" className={linkClass(scrolled)}>Vorteile</a>
          <a href="#faq" className={linkClass(scrolled)}>FAQ</a>
          <a
            href="#formular"
            className={`text-sm font-semibold px-5 py-2 rounded-lg transition-all ${
              scrolled
                ? "bg-[#e36414] text-white hover:bg-[#fb8b24]"
                : "bg-white/15 text-white hover:bg-white/25 backdrop-blur-sm"
            }`}
          >
            Vergleich starten
          </a>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`sm:hidden p-2 ${scrolled ? "text-stone-900" : "text-white"}`}
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
        <div className="sm:hidden bg-white border-t border-stone-200 shadow-lg animate-fade-in">
          <nav className="flex flex-col p-4 gap-3">
            <a href="#wie-es-funktionert" onClick={() => setMenuOpen(false)} className="text-stone-700 font-medium py-2">
              Wie es funktioniert
            </a>
            <a href="#vorteile" onClick={() => setMenuOpen(false)} className="text-stone-700 font-medium py-2">
              Vorteile
            </a>
            <a href="#faq" onClick={() => setMenuOpen(false)} className="text-stone-700 font-medium py-2">
              FAQ
            </a>
            <a
              href="#formular"
              onClick={() => setMenuOpen(false)}
              className="btn-accent text-center py-3 rounded-xl"
            >
              Vergleich starten
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
