"use client";

/* eslint-disable @next/next/no-img-element */

const CAROUSEL_INSURERS: { name: string; domain: string }[] = [
  { name: "CSS", domain: "css.ch" },
  { name: "Helsana", domain: "helsana.ch" },
  { name: "SWICA", domain: "swica.ch" },
  { name: "Concordia", domain: "concordia.ch" },
  { name: "Visana", domain: "visana.ch" },
  { name: "Sanitas", domain: "sanitas.com" },
  { name: "KPT", domain: "kpt.ch" },
  { name: "Atupri", domain: "atupri.ch" },
  { name: "Assura", domain: "assura.ch" },
  { name: "Sympany", domain: "sympany.ch" },
  { name: "ÖKK", domain: "oekk.ch" },
  { name: "EGK", domain: "egk.ch" },
  { name: "Mutuel", domain: "groupemutuel.ch" },
  { name: "Aquilana", domain: "aquilana.ch" },
];

function getLogoUrl(domain: string) {
  return `https://cdn.brandfetch.io/domain/${domain}?c=1idc9vLyOz1J1qurgu6`;
}

export function InsurerCarousel() {
  // Duplicate list for seamless infinite scroll
  const items = [...CAROUSEL_INSURERS, ...CAROUSEL_INSURERS];

  return (
    <div className="mt-8 relative">
      <p className="text-[10px] uppercase tracking-widest text-white/20 mb-4 text-center">
        Vergleichen Sie unter anderem
      </p>

      {/* Carousel container */}
      <div className="relative overflow-hidden">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-[#0a1128] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-[#0a1128] to-transparent z-10 pointer-events-none" />

        {/* Scrolling track */}
        <div className="flex items-center gap-10 sm:gap-14 animate-scroll-logos">
          {items.map((insurer, i) => (
            <div
              key={`${insurer.domain}-${i}`}
              className="flex-shrink-0 flex items-center justify-center h-8 sm:h-9"
            >
              <img
                src={getLogoUrl(insurer.domain)}
                alt={insurer.name}
                className="h-6 sm:h-7 w-auto max-w-[100px] object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-90 transition-all duration-300"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
