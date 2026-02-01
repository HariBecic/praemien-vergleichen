"use client";

import { useState, useCallback } from "react";

/* eslint-disable @next/next/no-img-element */

const CAROUSEL_INSURERS: { name: string; domain: string }[] = [
  { name: "Helsana", domain: "helsana.ch" },
  { name: "Sanitas", domain: "sanitas.com" },
  { name: "SWICA", domain: "swica.ch" },
  { name: "Concordia", domain: "concordia.ch" },
  { name: "Assura", domain: "assura.ch" },
  { name: "CSS", domain: "css.ch" },
  { name: "Visana", domain: "visana.ch" },
  { name: "KPT", domain: "kpt.ch" },
  { name: "Atupri", domain: "atupri.ch" },
  { name: "Sympany", domain: "sympany.ch" },
  { name: "ÖKK", domain: "oekk.ch" },
  { name: "EGK", domain: "egk.ch" },
  { name: "Groupe Mutuel", domain: "groupemutuel.ch" },
  { name: "Aquilana", domain: "aquilana.ch" },
];

const BF = "1idc9vLyOz1J1qurgu6";

// Brandfetch Logo API — type "logo" returns full wordmark with transparent bg
// Format: /{domain}/logo (NOT /domain/{domain} which returns favicon icons)
const URLS = (d: string) => [
  `https://cdn.brandfetch.io/${d}/logo?c=${BF}`,          // Full wordmark logo
  `https://cdn.brandfetch.io/${d}/symbol?c=${BF}`,        // Symbol/mark
  `https://cdn.brandfetch.io/${d}/w/400/logo?c=${BF}`,    // Logo with width param
];

function InsurerLogo({ name, domain }: { name: string; domain: string }) {
  const [attempt, setAttempt] = useState(0);
  const urls = URLS(domain);

  const handleError = useCallback(() => {
    setAttempt((a) => a + 1);
  }, []);

  // All image URLs failed → show text
  if (attempt >= urls.length) {
    return (
      <span className="text-xl sm:text-2xl font-semibold text-white/[0.18] whitespace-nowrap tracking-wide">
        {name}
      </span>
    );
  }

  return (
    <img
      src={urls[attempt]}
      alt={name}
      className="h-9 sm:h-11 w-auto max-w-[180px] object-contain brightness-0 invert opacity-[0.22] hover:opacity-[0.5] transition-opacity duration-300"
      loading="lazy"
      onError={handleError}
    />
  );
}

export function InsurerCarousel() {
  const items = [...CAROUSEL_INSURERS, ...CAROUSEL_INSURERS];

  return (
    <div className="mt-10 relative">
      <div className="relative overflow-hidden py-6">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-[#0a1128] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-[#0a1128] to-transparent z-10 pointer-events-none" />

        {/* Scrolling track */}
        <div className="flex items-center gap-14 sm:gap-20 animate-scroll-logos px-4">
          {items.map((insurer, i) => (
            <div key={`${insurer.domain}-${i}`} className="flex-shrink-0 flex items-center justify-center min-h-[44px]">
              <InsurerLogo name={insurer.name} domain={insurer.domain} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
