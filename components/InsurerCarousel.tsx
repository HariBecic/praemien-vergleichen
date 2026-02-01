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

const BF_CLIENT = "1idc9vLyOz1J1qurgu6";

function InsurerLogo({ name, domain }: { name: string; domain: string }) {
  const [failed, setFailed] = useState(false);

  const handleError = useCallback(() => setFailed(true), []);

  if (failed) {
    return (
      <span className="text-xl sm:text-2xl font-semibold text-white/[0.15] whitespace-nowrap">
        {name}
      </span>
    );
  }

  return (
    <img
      src={`https://cdn.brandfetch.io/domain/${domain}?c=${BF_CLIENT}`}
      alt={name}
      className="h-10 sm:h-12 w-auto max-w-[180px] object-contain brightness-0 invert opacity-[0.2] hover:opacity-[0.5] transition-opacity duration-300"
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
            <div key={`${insurer.domain}-${i}`} className="flex-shrink-0">
              <InsurerLogo name={insurer.name} domain={insurer.domain} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
