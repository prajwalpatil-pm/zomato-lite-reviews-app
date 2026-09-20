"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sym } from "@/app/_components/sym";
import { ratingWord } from "@/lib/format";

const MAX = 500;

// Per-rating visual config (matches the UI reference).
const TIERS: Record<
  number,
  { starBg: string; starText: string; badge: string; caption: string; icon: string }
> = {
  1: { starBg: "bg-error-container", starText: "text-error", badge: "bg-error-container text-on-error-container", caption: "text-error", icon: "sentiment_very_dissatisfied" },
  2: { starBg: "bg-error-container", starText: "text-error", badge: "bg-error-container text-on-error-container", caption: "text-error", icon: "sentiment_dissatisfied" },
  3: { starBg: "bg-tertiary-fixed", starText: "text-tertiary", badge: "bg-tertiary-fixed text-on-tertiary-fixed", caption: "text-tertiary", icon: "sentiment_satisfied" },
  4: { starBg: "bg-secondary-container", starText: "text-secondary", badge: "bg-secondary-container text-on-secondary-container", caption: "text-secondary", icon: "sentiment_very_satisfied" },
  5: { starBg: "bg-primary-fixed", starText: "text-primary", badge: "bg-primary-fixed text-primary", caption: "text-primary", icon: "stars" },
};

const HIGHLIGHTS = [
  { emoji: "🔥", label: "Great Spice", phrase: "Great spice." },
  { emoji: "⚡", label: "Lightning Fast", phrase: "Lightning fast service." },
  { emoji: "🌯", label: "Generous Portion", phrase: "Generous portions." },
  { emoji: "🌱", label: "Good Veg Options", phrase: "Good veg options." },
];

export function ReviewForm({
  restaurantId,
  restaurantName,
}: {
  restaurantId: number;
  restaurantName: string;
}) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [published, setPublished] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // FRONTEND validation = kindness (stops honest mistakes). The backend
  // re-checks everything anyway — that is what keeps the data safe.
  const valid = rating > 0 && comment.trim().length > 0;
  const tier = rating > 0 ? TIERS[rating] : null;

  function toggleHighlight(phrase: string) {
    setComment((c) =>
      c.includes(phrase)
        ? c.replace(phrase, "").replace(/\s+/g, " ").trim()
        : `${c.trim()} ${phrase}`.trim(),
    );
  }

  async function handleSubmit() {
    if (!valid || submitting) return;
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ restaurantId, rating, comment }),
    });

    if (res.ok) {
      setPublished(true);
      // Let the "Published!" state show, then go see the recomputed average.
      setTimeout(() => {
        router.push(`/restaurant/${restaurantId}`);
        router.refresh();
      }, 700);
      return;
    }

    // Show exactly what the backend said — we do not invent our own message.
    const data = await res.json().catch(() => null);
    setError(data?.error ?? "Something went wrong. Please try again.");
    setSubmitting(false);
  }

  return (
    <div>
      <div className="space-y-6 rounded-xl bg-surface-container-lowest p-4 shadow-sm">
        {/* 1. Star rating */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-on-surface">Rate it</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                tier ? tier.badge : "bg-surface-container-high text-on-surface-variant"
              }`}
            >
              {rating} / 5
            </span>
          </div>

          <div className="flex items-center justify-between gap-1">
            {[1, 2, 3, 4, 5].map((n) => {
              const on = tier !== null && n <= rating;
              return (
                <button
                  key={n}
                  type="button"
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  onClick={() => setRating(n)}
                  className={`flex h-[54px] w-[54px] items-center justify-center rounded-xl transition-all active:scale-95 ${
                    on
                      ? `${tier!.starBg} ${tier!.starText} scale-[1.02]`
                      : "bg-surface-container-low text-outline-variant"
                  }`}
                >
                  <Sym name="star" fill={on} className="text-[28px]" />
                </button>
              );
            })}
          </div>

          <div className="mt-2 flex items-center justify-between">
            {tier ? (
              <p className={`flex items-center gap-1 text-xs font-semibold ${tier.caption}`}>
                <Sym name={tier.icon} className="text-[16px]" />
                <span>
                  {rating} out of 5 stars — {ratingWord(rating)}
                </span>
              </p>
            ) : (
              <p className="text-xs text-on-surface-variant">Tap a star to rate</p>
            )}
            {rating > 0 && (
              <span className="text-[10px] font-medium text-on-surface-variant">
                Tap to update
              </span>
            )}
          </div>
        </div>

        {/* 2. Review text */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-sm font-semibold text-on-surface">Your review</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
              Required
            </span>
          </div>
          <textarea
            value={comment}
            maxLength={MAX}
            rows={4}
            onChange={(e) => setComment(e.target.value)}
            placeholder="How was the food, the service, the vibe?"
            className="w-full resize-none rounded-xl bg-surface-container-low p-3 text-sm leading-relaxed text-on-surface outline-none transition placeholder:text-outline/70 focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary"
          />
          <div className="mt-1.5 flex items-center justify-between px-0.5">
            {comment.trim().length > 0 ? (
              <span className="flex items-center gap-1 text-xs font-medium text-secondary">
                <Sym name="check_circle" className="text-[14px]" />
                Ready to share
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-outline">
                <Sym name="edit_note" className="text-[14px]" />
                Tell others about it
              </span>
            )}
            <span className="text-[10px] text-on-surface-variant">
              {comment.length}/{MAX}
            </span>
          </div>
        </div>

        {/* 3. Quick highlights (tap to add to your review) */}
        <div>
          <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
            Quick highlights
          </span>
          <div className="flex flex-wrap gap-1.5">
            {HIGHLIGHTS.map((h) => {
              const on = comment.includes(h.phrase);
              return (
                <button
                  key={h.label}
                  type="button"
                  onClick={() => toggleHighlight(h.phrase)}
                  className={`rounded-full px-3 py-1.5 text-xs transition-all ${
                    on
                      ? "bg-primary-fixed font-semibold text-primary"
                      : "bg-surface-container-high text-on-surface"
                  }`}
                >
                  {h.emoji} {h.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Error straight from the backend */}
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary-fixed px-3 py-2.5 text-xs font-semibold text-primary">
            <Sym name="error" className="text-[16px]" />
            {error}
          </div>
        )}

        {/* 4. Submit */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!valid || submitting || published}
            className={`flex h-12 w-full items-center justify-center gap-1 rounded-xl text-sm font-semibold shadow-sm transition-all ${
              published
                ? "bg-secondary text-on-secondary"
                : valid && !submitting
                  ? "bg-primary text-on-primary hover:bg-primary-container active:scale-[0.98]"
                  : "cursor-not-allowed bg-surface-container-highest text-on-surface-variant/50"
            }`}
          >
            {published ? (
              <>
                <Sym name="check" className="text-[20px]" />
                Review Published!
              </>
            ) : submitting ? (
              <>
                <Sym name="progress_activity" className="animate-spin text-[20px]" />
                Submitting…
              </>
            ) : (
              <>
                <Sym name="rate_review" className="text-[20px]" />
                Submit Review
              </>
            )}
          </button>

          <div className="flex items-start justify-center gap-1.5 px-2 text-center">
            <Sym name="info" className="mt-0.5 shrink-0 text-[16px] text-outline" />
            <p className="text-xs leading-tight text-outline">
              Your review of {restaurantName} is public and cannot be edited or deleted.
            </p>
          </div>
        </div>
      </div>

      {/* Community vibe card */}
      <div className="mt-4 flex items-center gap-3 rounded-xl bg-surface-container p-3 shadow-sm">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
          <Sym name="thumb_up" className="text-[20px]" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-xs font-bold text-on-surface">
            Zomato Foodie Community
          </h3>
          <p className="truncate text-xs text-on-surface-variant">
            Your reviews help 1,200+ local diners decide every week.
          </p>
        </div>
      </div>
    </div>
  );
}
