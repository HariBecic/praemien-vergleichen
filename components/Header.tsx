"use client";

import { useState, useEffect } from "react";
import { Logo } from "./Logo";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
        <Logo size="small" className="text-white" />

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-6">
          <a href="#wie-es-funktionert" className="text-sm font-medium text-white/60 hover:text-white transition-colors">
            Wie es funktioniert
          </a>
          <a href="#vorteile" className="text-sm font-medium text-white/60 hover:text-white transition-colors">
            Vorteile
          </a>
          <a href="#faq" className="text-sm font-medium text-white/60 hover:text-white transition-colors">
            FAQ
          </a>
          <a
            href="#formular"
            className="text-sm font-semibold px-5 py-2 rounded-lg transition-all bg-white/[0.08] text-white hover:bg-white/[0.14] border border-white/[0.1] backdrop-blur-sm"
          >
            Vergleich starten
          </a>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden p-2 text-white"
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
        <div className="sm:hidden border-t border-white/[0.06] bg-[#0a1128]/95 backdrop-blur-xl animate-fade-in">
          <nav className="flex flex-col p-4 gap-3">
            <a href="#wie-es-funktionert" onClick={() => setMenuOpen(false)} className="text-white/70 font-medium py-2 hover:text-white transition-colors">
              Wie es funktioniert
            </a>
            <a href="#vorteile" onClick={() => setMenuOpen(false)} className="text-white/70 font-medium py-2 hover:text-white transition-colors">
              Vorteile
            </a>
            <a href="#faq" onClick={() => setMenuOpen(false)} className="text-white/70 font-medium py-2 hover:text-white transition-colors">
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
