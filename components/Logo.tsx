export function Logo({ className = "", size = "default" }: { className?: string; size?: "small" | "default" | "large" }) {
  const sizes = {
    small: { cross: 28, text: 13, text2: 15.5, gap: "gap-2" },
    default: { cross: 34, text: 16, text2: 19, gap: "gap-2.5" },
    large: { cross: 42, text: 20, text2: 24, gap: "gap-3" },
  };
  const s = sizes[size];

  return (
    <a href="/" className={`flex items-center ${s.gap} ${className}`}>
      {/* Swiss Cross */}
      <svg width={s.cross} height={s.cross} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
        <rect x="14" y="2" width="12" height="36" rx="1.5" fill="currentColor" />
        <rect x="2" y="14" width="36" height="12" rx="1.5" fill="currentColor" />
      </svg>
      {/* Text */}
      <div className="flex flex-col leading-[1.1]">
        <span style={{ fontSize: s.text, letterSpacing: "0.03em" }} className="font-light text-white/80">
          Prämien
        </span>
        <span style={{ fontSize: s.text2, letterSpacing: "-0.01em" }} className="font-bold text-white">
          vergleichen
        </span>
      </div>
    </a>
  );
}
