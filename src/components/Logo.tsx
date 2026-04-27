import { Link } from "@tanstack/react-router";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const text = size === "lg" ? "text-3xl" : size === "sm" ? "text-lg" : "text-xl";
  const dot = size === "lg" ? "h-3 w-3" : "h-2.5 w-2.5";
  return (
    <Link to="/" className="inline-flex items-center gap-2 group">
      <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[var(--shadow-glow)]">
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2c3 3 4 6 4 9a4 4 0 0 1-8 0c0-3 1-6 4-9z" />
          <path d="M5 14c2 4 5 6 7 6s5-2 7-6" />
        </svg>
        <span className={`absolute -right-0.5 -top-0.5 ${dot} rounded-full bg-accent ring-2 ring-background`} />
      </span>
      <span className={`font-display font-bold tracking-tight ${text}`}>
        Food<span className="text-primary">Bridge</span>
      </span>
    </Link>
  );
}
