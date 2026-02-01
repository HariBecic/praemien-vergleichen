"use client";

import { useState, useCallback } from "react";

/* eslint-disable @next/next/no-img-element */

const CAROUSEL_INSURERS = [
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

const TOKEN = "pk_GOP0fCJ8S7K5co3PhIqOzg";

function InsurerLogo({ name, domain }: { name: string; domain: string }) {
  const [failed, setFailed] = useState(false);
  const handleError = useCallback(() => setFailed(true), []);

  if (failed) {
    return (
      <span className="text-[20px] sm:text-[24px] font-semibold text-white/20 whitespace-nowrap select-none">
        {name}
      </span>
    );
  }

  return (
    <img
      src={`https://img.logo.dev/${domain}?token=${TOKEN}&format=png&size=120`}
      alt={name}
      className="h-10 sm:h-12 w-auto max-w-[180px] object-contain brightness-0 invert opacity-30 hover:opacity-50 transition-opacity duration-300"
      loading="lazy"
      onError={handleError}
    />
  );
}

export function InsurerCarousel() {
  const items = [...CAROUSEL_INSURERS, ...CAROUSEL_INSURERS];

  return (
    <div className="mt-8 relative overflow-hidden">
      {/* Fade edges - transparent gradient, no visible bar */}
      <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 z-10 pointer-events-none bg-gradient-to-r from-[#050a18] via-[#0a1128]/80 to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 z-10 pointer-events-none bg-gradient-to-l from-[#050a18] via-[#0a1128]/80 to-transparent" />

      {/* Scrolling track */}
      <div className="flex items-center gap-12 sm:gap-16 animate-scroll-logos">
        {items.map((insurer, i) => (
          <div key={`${insurer.domain}-${i}`} className="flex-shrink-0 flex items-center justify-center h-12">
            <InsurerLogo name={insurer.name} domain={insurer.domain} />
          </div>
        ))}
      </div>
    </div>
  );
}
