import { StarIcon } from "./icons";
import { ratingColor, initials } from "@/lib/format";

// The little "BETA" chip in the top-right of every screen.
export function BetaBadge() {
  return (
    <span className="rounded bg-brand-tint px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em] text-brand">
      Beta
    </span>
  );
}

// A Zomato-style rating chip: a solid colour driven by the score, with a star.
// `label` is what to print (e.g. "4" for a review, "4.3" for an average).
export function RatingBadge({
  score,
  label,
  size = "sm",
}: {
  score: number;
  label: string;
  size?: "sm" | "lg";
}) {
  const bg = ratingColor(score);
  const big = size === "lg";
  return (
    <span
      style={{ backgroundColor: bg }}
      className={`inline-flex items-center font-bold text-white ${
        big ? "gap-1 rounded-md px-2 py-1 text-sm" : "gap-0.5 rounded px-1.5 py-0.5 text-xs"
      }`}
    >
      {label}
      <StarIcon className={big ? "h-3.5 w-3.5" : "h-3 w-3"} />
    </span>
  );
}

// A round monogram derived from a name ("Ludhiana Burrito" -> "LB").
export function Monogram({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center justify-center font-extrabold ${className}`}
    >
      {initials(name)}
    </span>
  );
}
