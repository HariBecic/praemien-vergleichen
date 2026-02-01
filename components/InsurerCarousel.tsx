"use client";

const INSURERS = [
  "Helsana",
  "CSS",
  "SWICA",
  "Concordia",
  "Visana",
  "KPT",
  "Groupe Mutuel",
  "Sanitas",
  "Assura",
  "Atupri",
  "Sympany",
  "ÖKK",
  "EGK",
];

export function InsurerCarousel() {
  // Duplicate for seamless loop
  const items = [...INSURERS, ...INSURERS];

  return (
    <div style={{ marginTop: "2.5rem" }}>
      {/* Keyframes can only be defined in a style tag, not inline */}
      <style>{`
        @keyframes _cscroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
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

      {/* Fade edges via mask */}
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
        {/* Scrolling track — all inline styles, zero class dependencies */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "3.5rem",
            animation: "_cscroll 40s linear infinite",
            width: "max-content",
            willChange: "transform",
          }}
        >
          {items.map((name, i) => (
            <span
              key={`${name}-${i}`}
              style={{
                flexShrink: 0,
                fontSize: "1.1rem",
                fontWeight: 600,
                letterSpacing: name === name.toUpperCase() ? "0.15em" : "0.03em",
                color: "rgba(255,255,255,0.2)",
                whiteSpace: "nowrap",
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                transition: "color 0.3s",
                cursor: "default",
                userSelect: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.2)")}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
