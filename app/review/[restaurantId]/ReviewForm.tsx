"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StarIcon, PenIcon } from "@/app/_components/icons";

const MAX = 500;
const WORDS: Record<number, string> = {
  1: "Terrible",
  2: "Not great",
  3: "Good taste!",
  4: "Really good",
  5: "Excellent!",
};

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
  const [error, setError] = useState<string | null>(null);

  // The button is enabled only once a rating is picked and the comment is not
  // blank. This is FRONTEND validation — kindness, to stop honest mistakes.
  // The backend re-checks all of this anyway, which is what actually keeps the
  // data safe.
  const valid = rating > 0 && comment.trim().length > 0;

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
      // Saved. Go to the restaurant page, which will recompute the average.
      router.push(`/restaurant/${restaurantId}`);
      router.refresh();
      return;
    }

    // Show exactly what the backend said — we do not invent our own message.
    const data = await res.json().catch(() => null);
    setError(data?.error ?? "Something went wrong. Please try again.");
    setSubmitting(false);
  }

  return (
    <div className="mt-5">
      {/* Rating */}
      <div className="rounded-2xl border border-hairline bg-card p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">Rate it</h2>
          <span className="rounded-full bg-brand-tint px-2.5 py-1 text-xs font-bold text-brand">
            {rating} / 5
          </span>
        </div>

        <div className="mt-3 grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((n) => {
            const active = n <= rating;
            return (
              <button
                key={n}
                type="button"
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
                aria-pressed={active}
                onClick={() => setRating(n)}
                className={`flex h-16 items-center justify-center rounded-xl transition active:scale-95 ${
                  active ? "bg-brand-tint" : "bg-canvas"
                }`}
              >
                <StarIcon
                  filled={active}
                  className={`h-7 w-7 ${active ? "text-rate-amber" : "text-brand/25"}`}
                />
              </button>
            );
          })}
        </div>

        <div className="mt-2.5 flex items-center justify-between text-sm">
          <span className={rating > 0 ? "font-semibold text-rate-amber" : "text-ink-3"}>
            {rating > 0
              ? `${rating} out of 5 stars — ${WORDS[rating]}`
              : "Tap a star to rate"}
          </span>
          {rating > 0 && (
            <span className="text-xs font-medium text-ink-3">Tap to update</span>
          )}
        </div>
      </div>

      {/* Comment */}
      <div className="mt-4 rounded-2xl border border-hairline bg-card p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">Your review</h2>
          <span className="text-xs font-extrabold uppercase tracking-wide text-brand">
            Required
          </span>
        </div>

        <textarea
          value={comment}
          maxLength={MAX}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="What did you order? How was the taste, portion and service?"
          className="mt-3 w-full resize-none rounded-xl bg-canvas p-3 text-[15px] leading-relaxed text-ink outline-none ring-1 ring-transparent transition placeholder:text-ink-3 focus:ring-ink/20"
        />

        <div className="mt-2 flex items-center justify-between text-sm">
          {comment.trim().length > 0 ? (
            <span className="inline-flex items-center gap-1.5 font-semibold text-rate-green">
              <CheckMark /> Ready to share
            </span>
          ) : (
            <span className="text-ink-3">Tell others about your experience</span>
          )}
          <span className="text-xs font-medium text-ink-3">
            {comment.length}/{MAX}
          </span>
        </div>
      </div>

      {/* Error straight from the backend */}
      {error && (
        <div className="mt-4 rounded-xl border border-brand/30 bg-brand-tint px-3 py-2.5 text-sm font-semibold text-brand">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!valid || submitting}
        className={`mt-4 flex h-13 w-full items-center justify-center gap-2 rounded-lg py-3.5 text-base font-bold text-white transition ${
          valid && !submitting
            ? "bg-brand active:scale-[0.98]"
            : "cursor-not-allowed bg-brand/40"
        }`}
      >
        {submitting ? (
          "Submitting…"
        ) : (
          <>
            <PenIcon className="h-5 w-5" />
            Submit Review
          </>
        )}
      </button>

      <p className="mt-3 text-center text-xs text-ink-3">
        Your review of {restaurantName} is public and cannot be edited or deleted.
      </p>
    </div>
  );
}

function CheckMark() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M8.5 12.5l2.2 2.2 4.8-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
