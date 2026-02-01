"use client";

/* eslint-disable @next/next/no-img-element */

const INSURERS = [
  { name: "Helsana", file: "helsana.png" },
  { name: "CSS", file: "css.png" },
  { name: "SWICA", file: "swica.png" },
  { name: "Concordia", file: "concordia.png" },
  { name: "Visana", file: "visana.png" },
  { name: "KPT", file: "kpt.png" },
  { name: "Groupe Mutuel", file: "groupemutuel.png" },
  { name: "Sanitas", file: "sanitas.png" },
  { name: "Assura", file: "assura.png" },
  { name: "Atupri", file: "atupri.png" },
  { name: "Sympany", file: "sympany.svg" },
  { name: "ÖKK", file: "oekk.svg" },
  { name: "EGK", file: "egk.svg" },
];

export function InsurerCarousel() {
  const items = [...INSURERS, ...INSURERS, ...INSURERS];

  return (
    <div style={{ marginTop: "2.5rem" }}>
      <style>{`
        @keyframes _cscroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-33.333%, 0, 0); }
        }
        ._ct {
          display: flex;
          align-items: center;
          gap: 3rem;
          animation: _cscroll 45s linear infinite;
          width: max-content;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        ._ct:hover { animation-play-state: paused; }
        ._cl {
          flex-shrink: 0;
          height: 44px;
          width: auto;
          object-fit: contain;
          opacity: 0.75;
          transition: opacity 0.3s ease;
        }
        ._cl:hover { opacity: 1; }
      `}</style>

      <p
        style={{
          fontSize: "10px",
          textTransform: "uppercase",
          letterSpacing: "0.25em",
          color: "rgba(255,255,255,0.2)",
          marginBottom: "1.25rem",
          textAlign: "center",
          fontWeight: 500,
        }}
      >
        Vergleichen Sie unter anderem
      </p>

      <div
        style={{
          position: "relative",
          overflow: "hidden",
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div className="_ct">
          {items.map((ins, i) => (
            <img
              key={`${ins.file}-${i}`}
              className="_cl"
              src={`/logos/${ins.file}`}
              alt={ins.name}
              draggable={false}
              loading="eager"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
