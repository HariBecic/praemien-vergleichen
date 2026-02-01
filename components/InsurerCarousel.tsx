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

  if (failed) return null;

  return (
    <div className="flex-shrink-0 flex items-center gap-3 opacity-50 hover:opacity-80 transition-opacity duration-300">
      <img
        src={`https://img.logo.dev/${domain}?token=${TOKEN}&format=png&size=80&retina=true`}
        alt={name}
        className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg object-contain"
        loading="lazy"
        onError={handleError}
      />
      <span className="text-white/60 text-base sm:text-lg font-medium whitespace-nowrap">
        {name}
      </span>
    </div>
  );
}

export function InsurerCarousel() {
  const items = [...CAROUSEL_INSURERS, ...CAROUSEL_INSURERS];

  return (
    <div
      className="mt-8 relative overflow-hidden"
      style={{
        maskImage: "linear-gradient(to right, transparent, black 80px, black calc(100% - 80px), transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 80px, black calc(100% - 80px), transparent)",
      }}
    >
      <div className="flex items-center gap-10 sm:gap-14 animate-scroll-logos">
        {items.map((insurer, i) => (
          <InsurerLogo key={`${insurer.domain}-${i}`} name={insurer.name} domain={insurer.domain} />
        ))}
      </div>
    </div>
  );
}
