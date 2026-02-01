/* eslint-disable @next/next/no-img-element */
export function Logo({ className = "", size = "default" }: { className?: string; size?: "small" | "default" | "large" }) {
  const heights: Record<string, string> = {
    small: "h-8 sm:h-9",
    default: "h-10 sm:h-11",
    large: "h-14 sm:h-16",
  };

  return (
    <a href="/" className={`inline-block ${className}`}>
      <img
        src="/logo.svg"
        alt="Prämien vergleichen"
        className={`${heights[size]} w-auto`}
      />
    </a>
  );
}
