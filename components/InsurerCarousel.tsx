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
    <div className="flex-shrink-0">
      <div className="bg-white rounded-xl px-4 py-3 flex items-center justify-center opacity-60 hover:opacity-90 transition-opacity duration-300">
        <img
          src={`https://img.logo.dev/${domain}?token=${TOKEN}&format=png&size=120`}
          alt={name}
          className="h-7 sm:h-8 w-auto max-w-[140px] object-contain grayscale hover:grayscale-0 transition-all duration-300"
          loading="lazy"
          onError={handleError}
        />
      </div>
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
      <div className="flex items-center gap-6 sm:gap-8 animate-scroll-logos">
        {items.map((insurer, i) => (
          <InsurerLogo key={`${insurer.domain}-${i}`} name={insurer.name} domain={insurer.domain} />
        ))}
      </div>
    </div>
  );
}
