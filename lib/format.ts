// Small PRESENTATION helpers. None of this is business logic — no averaging,
// no counting, no sorting. Those all happen in the backend. This file only
// decides how already-computed values are shown on screen (a colour, initials,
// a human-friendly "2 days ago").

// Zomato-style rating colours: green is good, amber is middling, red is poor.
export function ratingColor(score: number): string {
  if (score >= 4) return "#239653"; // green  (4.0 - 5.0)
  if (score >= 2) return "#d9822b"; // amber  (2.0 - 3.9)
  return "#e23744"; // red    (1.0 - 1.9)
}

// "Ludhiana Burrito" -> "LB". Just reading letters off a string, not computing a fact.
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

// Turns a timestamp into "just now" / "10m ago" / "2d ago". This is date
// formatting for display, the same kind of thing as formatting currency.
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
