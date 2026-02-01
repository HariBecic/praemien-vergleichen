"use client";

import Image from "next/image";
import { useState } from "react";

const BF = "1idc9vLyOz1J1qurgu6";

const INSURERS = [
  { name: "Helsana", domain: "helsana.ch" },
  { name: "CSS", domain: "css.ch" },
  { name: "SWICA", domain: "swica.ch" },
  { name: "Concordia", domain: "concordia.ch" },
  { name: "Visana", domain: "visana.ch" },
  { name: "KPT", domain: "kpt.ch" },
  { name: "Groupe Mutuel", domain: "groupemutuel.ch" },
  { name: "Sanitas", domain: "sanitas.com" },
  { name: "Assura", domain: "assura.ch" },
  { name: "Atupri", domain: "atupri.ch" },
  { name: "Sympany", domain: "sympany.ch" },
  { name: "ÖKK", domain: "oekk.ch" },
  { name: "EGK", domain: "egk.ch" },
];

function LogoImg({ name, domain }: { name: string; domain: string }) {
  const [err, setErr] = useState(false);

  if (err) {
    return (
      <span
        style={{
          flexShrink: 0,
          fontSize: "18px",
          fontWeight: 700,
          color: "rgba(255,255,255,0.35)",
          whiteSpace: "nowrap",
        }}
      >
        {name}
      </span>
    );
  }

  return (
    <Image
      src={`https://cdn.brandfetch.io/${domain}/logo.png?c=${BF}`}
      alt={name}
      width={200}
      height={50}
      priority
      unoptimized
      onError={() => setErr(true)}
      style={{
        flexShrink: 0,
        height: "44px",
        width: "auto",
        objectFit: "contain",
        filter: "brightness(0) invert(1)",
        opacity: 0.35,
      }}
    />
  );
}

export function InsurerCarousel() {
  const items = [...INSURERS, ...INSURERS];

  return (
    <div style={{ marginTop: "2.5rem" }}>
      <style>{`
        @keyframes _cscroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        ._ct {
          display: flex;
          align-items: center;
          gap: 3rem;
          animation: _cscroll 35s linear infinite;
          width: max-content;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        ._ct:hover { animation-play-state: paused; }
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
            <LogoImg
              key={`${ins.domain}-${i}`}
              name={ins.name}
              domain={ins.domain}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
