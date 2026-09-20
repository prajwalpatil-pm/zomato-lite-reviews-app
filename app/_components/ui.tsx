import { Sym } from "./sym";
import { ratingTierClasses } from "@/lib/format";

// The "BETA" chip in the top-right of every screen.
export function BetaBadge() {
  return (
    <span className="rounded-full bg-primary-fixed px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
      Beta
    </span>
  );
}

// A Zomato-style rating chip: a solid colour driven by the score, with a star.
// `label` is what to print ("4" for a review, "4.3" for an average).
export function RatingChip({
  score,
  label,
  showSlash = false,
  size = "sm",
}: {
  score: number;
  label: string;
  showSlash?: boolean;
  size?: "sm" | "lg";
}) {
  const big = size === "lg";
  return (
    <span
      className={`inline-flex items-center rounded font-bold shadow-sm ${ratingTierClasses(
        score,
      )} ${big ? "gap-1 px-3 py-1.5 text-sm" : "gap-0.5 px-2 py-0.5 text-xs"}`}
    >
      <span>{label}</span>
      {showSlash && (
        <span className={`opacity-80 ${big ? "text-[11px]" : "text-[9px]"}`}>/5</span>
      )}
      <Sym name="star" fill className={big ? "text-[14px]" : "text-[12px]"} />
    </span>
  );
}
