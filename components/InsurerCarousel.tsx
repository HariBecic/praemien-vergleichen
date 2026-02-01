"use client";

import { useRef, useState, useCallback } from "react";

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

function InsurerLogo({ name, domain }: { name: string; domain: string }) {
  const [showText, setShowText] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleError = useCallback(() => setShowText(true), []);

  // Detect Brandfetch placeholder: if loaded image is nearly square (icon/placeholder)
  // Real wordmark logos are wide (aspect ratio > 2)
  const handleLoad = useCallback(() => {
    const img = imgRef.current;
    if (!img) return;
    const ratio = img.naturalWidth / img.naturalHeight;
    // Brandfetch placeholders and icons are roughly square (ratio ~1)
    // Real wordmark logos are wide (ratio > 1.8)
    if (ratio < 1.5) {
      setShowText(true);
    }
  }, []);

  if (showText) {
    return (
      <span className="text-[22px] sm:text-[26px] font-semibold text-white/[0.18] whitespace-nowrap tracking-wide">
        {name}
      </span>
    );
  }

  return (
    <img
      ref={imgRef}
      src={`https://cdn.brandfetch.io/${domain}/logo?c=${BF}`}
      alt={name}
      style={{ mixBlendMode: "screen" }}
      className="h-9 sm:h-11 w-auto max-w-[200px] object-contain invert grayscale opacity-[0.4] hover:opacity-[0.7] transition-opacity duration-300"
      loading="lazy"
      onError={handleError}
      onLoad={handleLoad}
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
