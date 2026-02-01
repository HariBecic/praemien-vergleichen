export function Logo({ className = "", size = "default" }: { className?: string; size?: "small" | "default" | "large" }) {
  const sizes = {
    small: { h: "h-7", cross: 20, text: 11, text2: 13 },
    default: { h: "h-9", cross: 26, text: 14, text2: 16 },
    large: { h: "h-12", cross: 34, text: 18, text2: 21 },
  };
  const s = sizes[size];

  return (
    <a href="/" className={`flex items-center gap-2 ${className}`}>
      {/* Swiss Cross */}
      <svg width={s.cross} height={s.cross} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
        <rect x="14" y="2" width="12" height="36" rx="1" fill="currentColor" />
        <rect x="2" y="14" width="36" height="12" rx="1" fill="currentColor" />
      </svg>
      {/* Text */}
      <div className="flex flex-col leading-none">
        <span style={{ fontSize: s.text, letterSpacing: "0.02em" }} className="font-light text-white/90">
          Prämien
        </span>
        <span style={{ fontSize: s.text2, letterSpacing: "-0.01em" }} className="font-bold text-white">
          vergleichen
        </span>
      </div>
    </a>
  );
}
