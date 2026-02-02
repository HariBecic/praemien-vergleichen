"use client";

/* eslint-disable @next/next/no-img-element */

const CAROUSEL_INSURERS = [
  { name: "Helsana", file: "/logos/helsana.svg" },
  { name: "CSS", file: "/logos/css.svg" },
  { name: "SWICA", file: "/logos/swica.svg" },
  { name: "Concordia", file: "/logos/concordia.svg" },
  { name: "KPT", file: "/logos/kpt.svg" },
  { name: "Groupe Mutuel", file: "/logos/groupemutuel.svg" },
  { name: "Visana", file: "/logos/visana.svg" },
  { name: "Sanitas", file: "/logos/sanitas.svg" },
  { name: "Assura", file: "/logos/assura.svg" },
  { name: "Atupri", file: "/logos/atupri.svg" },
  { name: "ÖKK", file: "/logos/oekk.svg" },
  { name: "Sympany", file: "/logos/sympany.svg" },
];

export function InsurerCarousel() {
  const items = [...CAROUSEL_INSURERS, ...CAROUSEL_INSURERS, ...CAROUSEL_INSURERS];

  return (
    <div
      className="mt-8 relative overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 80px, black calc(100% - 80px), transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 80px, black calc(100% - 80px), transparent)",
      }}
    >
      <div className="flex items-center gap-16 sm:gap-24 animate-scroll-logos">
        {items.map((insurer, i) => (
          <div
            key={`${insurer.name}-${i}`}
            className="flex-shrink-0 flex items-center justify-center h-12"
          >
            <img
              src={insurer.file}
              alt={insurer.name}
              className="h-10 sm:h-12 w-auto max-w-[200px] object-contain opacity-30 hover:opacity-55 transition-opacity duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
