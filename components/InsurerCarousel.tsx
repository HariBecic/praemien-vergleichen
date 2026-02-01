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
    <div className="flex-shrink-0 flex items-center justify-center">
      <img
        src={`https://img.logo.dev/${domain}?token=${TOKEN}&format=png&size=240`}
        alt={name}
        className="h-14 sm:h-16 w-auto max-w-[200px] object-contain grayscale opacity-40 hover:grayscale-0 hover:opacity-80 transition-all duration-300"
        loading="lazy"
        onError={handleError}
      />
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
