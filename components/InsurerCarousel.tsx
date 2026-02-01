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
      <div className="relative overflow-hidden py-2">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-[#0a1128] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-l from-[#0a1128] to-transparent z-10 pointer-events-none" />

        {/* Scrolling track */}
        <div className="flex items-center gap-12 sm:gap-16 animate-scroll-logos">
          {items.map((insurer, i) => (
            <div
              key={`${insurer.domain}-${i}`}
              className="flex-shrink-0 flex flex-col items-center gap-2"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white/[0.07] border border-white/[0.08] flex items-center justify-center p-2 hover:bg-white/[0.12] transition-all">
                <img
                  src={getLogoUrl(insurer.domain)}
                  alt={insurer.name}
                  className="w-full h-full object-contain rounded-md"
                  loading="lazy"
                  onError={(e) => {
                    const el = e.target as HTMLImageElement;
                    el.style.display = "none";
                    const parent = el.parentElement;
                    if (parent) {
                      parent.innerHTML = `<span class="text-xs font-bold text-white/40">${insurer.name.slice(0, 3).toUpperCase()}</span>`;
                    }
                  }}
                />
              </div>
              <span className="text-[10px] text-white/30 font-medium">{insurer.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
