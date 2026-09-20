// Small PRESENTATION helpers. No business logic — no averaging, counting or
// sorting (that all happens in the backend). This only decides how already-
// computed values look on screen.

// Zomato-style rating colour, as Tailwind token classes (bg + text).
// Green is good, amber is middling, red is poor. Matches the UI reference.
export function ratingTierClasses(score: number): string {
  if (score >= 4) return "bg-secondary text-on-secondary";
  if (score >= 2) return "bg-tertiary-container text-on-tertiary-container";
  return "bg-primary text-on-primary";
}

// "Ludhiana Burrito" -> "LB". Just reading letters off a string.
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

// A short qualitative label for a chosen star rating.
export function ratingWord(rating: number): string {
  return (
    {
      1: "Needs serious improvement",
      2: "Below expectations",
      3: "Good taste!",
      4: "Really delicious!",
      5: "Outstanding experience!",
    }[rating] ?? ""
  );
}

// Turns a timestamp into "just now" / "10m ago" / "2d ago". Date formatting
// for display, the same kind of thing as formatting currency.
export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const secs = Math.max(0, Math.round((Date.now() - then) / 1000));
  if (secs < 45) return "just now";
  const mins = Math.round(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.round(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.round(days / 365)}y ago`;
}
