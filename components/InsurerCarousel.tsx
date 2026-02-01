"use client";

import { useEffect, useState } from "react";

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

const BF = "1idc9vLyOz1J1qurgu6";

function InsurerLogo({ name, domain }: { name: string; domain: string }) {
  const [status, setStatus] = useState<"loading" | "logo" | "text">("loading");
  const logoUrl = `https://cdn.brandfetch.io/${domain}/logo?c=${BF}`;

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      // Detect Brandfetch placeholders & icons with colored backgrounds
      // Real brand logos have TRANSPARENT backgrounds (alpha = 0 in corners)
      // Placeholders/icons have solid colored backgrounds (alpha > 0)
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setStatus("text");
          return;
        }
        ctx.drawImage(img, 0, 0);

        // Sample all 4 corners
        const corners = [
          ctx.getImageData(1, 1, 1, 1).data[3],
          ctx.getImageData(img.naturalWidth - 2, 1, 1, 1).data[3],
          ctx.getImageData(1, img.naturalHeight - 2, 1, 1).data[3],
          ctx.getImageData(img.naturalWidth - 2, img.naturalHeight - 2, 1, 1).data[3],
        ];

        // If ANY corner has significant opacity → has background → placeholder/icon
        const hasBackground = corners.some((alpha) => alpha > 30);

        // Also reject tiny images (icons, not logos)
        const tooSmall = img.naturalWidth < 80 || img.naturalHeight < 20;

        if (hasBackground || tooSmall) {
          setStatus("text");
        } else {
          setStatus("logo");
        }
      } catch {
        // CORS blocked canvas reading → can't verify, use text to be safe
        setStatus("text");
      }
    };

    img.onerror = () => setStatus("text");
    img.src = logoUrl;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [domain, logoUrl]);

  if (status === "loading") {
    // Invisible placeholder to prevent layout shift
    return <div className="h-8 w-24 sm:w-28" />;
  }

  if (status === "text") {
    return (
      <span className="text-[22px] sm:text-[26px] font-semibold text-white/25 whitespace-nowrap tracking-wide select-none">
        {name}
      </span>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={name}
      className="h-8 sm:h-10 w-auto max-w-[180px] object-contain brightness-0 invert opacity-25 hover:opacity-50 transition-opacity duration-300"
    />
  );
}

export function InsurerCarousel() {
  const items = [...CAROUSEL_INSURERS, ...CAROUSEL_INSURERS];

  return (
    <div className="mt-8">
      <div className="relative overflow-hidden">
        {/* Fade edges - exact match to page bg */}
        <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-[#0a1128] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-l from-[#0a1128] to-transparent z-10 pointer-events-none" />

        {/* Scrolling track - no padding, no background */}
        <div className="flex items-center gap-12 sm:gap-16 animate-scroll-logos">
          {items.map((insurer, i) => (
            <div
              key={`${insurer.domain}-${i}`}
              className="flex-shrink-0 flex items-center justify-center h-10"
            >
              <InsurerLogo name={insurer.name} domain={insurer.domain} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
