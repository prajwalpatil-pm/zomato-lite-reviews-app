import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import type { ReviewItem, RestaurantView } from "@/lib/types";
import { timeAgo } from "@/lib/format";
import { BetaBadge, RatingBadge } from "@/app/_components/ui";
import {
  ChatIcon,
  ClockIcon,
  MapPinIcon,
  PenIcon,
  VerifiedIcon,
} from "@/app/_components/icons";

// Always fetch fresh data. That is what lets a brand-new review change the
// average the instant you land back here — because the average is recomputed
// on every request, never stored.
export const dynamic = "force-dynamic";

// We are on a server, so fetch() needs an absolute URL. Build it from the
// incoming request's host (works on localhost and on Vercel alike).
async function apiBase() {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto =
    h.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export default async function RestaurantPage({
  params,
}: PageProps<"/restaurant/[id]">) {
  const { id } = await params;

  // THIS PAGE CALLS THE API AND RENDERS WHAT IT GETS. There is no averaging,
  // counting or sorting anywhere in this file — the backend already did it.
  const res = await fetch(`${await apiBase()}/api/restaurants/${id}`, {
    cache: "no-store",
  });
  if (res.status === 404) notFound();
  if (!res.ok) throw new Error("Could not load the restaurant.");
  const r: RestaurantView = await res.json();

  const hasReviews = r.totalReviews > 0;

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-hairline bg-card px-4 py-3">
        <div className="flex items-baseline">
          <span className="text-xl font-extrabold tracking-tight text-brand">
            zomato
          </span>
          <span className="text-xl font-semibold tracking-tight text-ink-2">
            -lite
          </span>
        </div>
        <BetaBadge />
      </header>

      <main className="flex-1 pb-4">
        {/* Hero banner */}
        <div className="relative mx-4 mt-4 h-36 overflow-hidden rounded-2xl bg-brand">
          <div className="absolute -left-6 -top-8 h-28 w-28 rounded-full border-8 border-white/10" />
          <div className="absolute -bottom-10 right-6 h-24 w-24 rounded-full border-8 border-white/10" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 text-3xl font-extrabold text-white ring-1 ring-white/25">
              {r.name
                .split(/\s+/)
                .filter(Boolean)
                .slice(0, 2)
                .map((w) => w[0]!.toUpperCase())
                .join("")}
            </span>
          </div>
        </div>

        {/* Main info card (pulled up over the hero) */}
        <section className="relative z-10 mx-4 -mt-6 rounded-2xl border border-hairline bg-card p-4 shadow-[0_4px_16px_rgba(0,0,0,0.05)]">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-2xl font-extrabold leading-tight text-ink">
              {r.name}
            </h1>
            {/* The average rating — computed by the backend, printed as-is. */}
            {r.averageRating === null ? (
              <span className="shrink-0 rounded-lg bg-ink-3/15 px-2.5 py-1.5 text-sm font-bold text-ink-2">
                New
              </span>
            ) : (
              <RatingBadge
                score={r.averageRating}
                label={r.averageRating.toFixed(1)}
                size="lg"
              />
            )}
          </div>

          <div className="mt-1.5 flex items-center gap-1 text-sm text-ink-2">
            <MapPinIcon className="h-4 w-4 text-ink-3" />
            <span>{r.area}</span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline px-3 py-1 text-xs font-semibold text-ink-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              {r.cuisine}
            </span>
            <span className="rounded-full border border-hairline px-3 py-1 text-xs font-semibold text-ink-2">
              Dine-in
            </span>
            <span className="rounded-full border border-hairline px-3 py-1 text-xs font-semibold text-ink-2">
              Delivery
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between rounded-xl bg-canvas px-3 py-2.5">
            <div className="flex items-center gap-2 text-sm text-ink-2">
              <ChatIcon className="h-4 w-4 text-ink-3" />
              {hasReviews ? (
                <span>
                  Based on{" "}
                  <span className="font-bold text-ink">{r.totalReviews}</span>{" "}
                  customer {r.totalReviews === 1 ? "review" : "reviews"}
                </span>
              ) : (
                <span>No reviews yet</span>
              )}
            </div>
            {hasReviews && (
              <span className="rounded bg-rate-green-tint px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-rate-green">
                Verified
              </span>
            )}
          </div>
        </section>

        {/* Latest review — highlighted so it sits apart from the rest */}
        {r.latestReview && (
          <section className="mx-4 mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-[0.1em] text-ink-3">
                Latest review
              </h2>
              <span className="h-3 w-3 rounded-full bg-rate-green" />
            </div>
            <LatestReviewCard review={r.latestReview} />
          </section>
        )}

        {/* Earlier reviews — a plain list */}
        {r.reviews.length > 0 && (
          <section className="mx-4 mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-[0.1em] text-ink-3">
                Earlier reviews
              </h2>
              <span className="text-xs font-semibold text-ink-3">
                {r.reviews.length} older
              </span>
            </div>
            <div className="mt-2 space-y-3">
              {r.reviews.map((review) => (
                <EarlierReviewCard key={review.id} review={review} />
              ))}
            </div>
          </section>
        )}

        {/* Empty state — invites the very first review */}
        {!hasReviews && (
          <section className="mx-4 mt-6 rounded-2xl border border-dashed border-hairline bg-card px-4 py-10 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-tint">
              <ChatIcon className="h-6 w-6 text-brand" />
            </span>
            <p className="mt-3 font-bold text-ink">No reviews yet</p>
            <p className="mt-1 text-sm text-ink-2">
              Be the first to review {r.name}.
            </p>
          </section>
        )}
      </main>

      {/* Sticky action bar */}
      <div className="sticky bottom-0 z-20 border-t border-hairline bg-card px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.05)]">
        <Link
          href={`/review/${id}`}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand text-base font-bold text-white transition active:scale-[0.98]"
        >
          <PenIcon className="h-5 w-5" />
          Write a Review
        </Link>
      </div>
    </>
  );
}

function ReviewerRow({ time }: { time: string }) {
  return (
    <div className="flex items-center gap-1 text-xs text-ink-3">
      <ClockIcon className="h-3.5 w-3.5" />
      {time}
    </div>
  );
}

function LatestReviewCard({ review }: { review: ReviewItem }) {
  return (
    <div className="mt-2 rounded-2xl border border-hairline border-l-4 border-l-rate-green bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-rate-green-tint px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-rate-green">
          Latest
        </span>
        <ReviewerRow time={timeAgo(review.createdAt)} />
      </div>
      <div className="mt-2.5 flex items-start gap-2">
        <span className="mt-0.5 shrink-0">
          <RatingBadge score={review.rating} label={String(review.rating)} />
        </span>
        <p className="text-[15px] font-medium leading-snug text-ink">
          {review.comment}
        </p>
      </div>
      <div className="mt-3 flex items-center gap-2 border-t border-hairline pt-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-tint text-xs font-bold text-brand">
          A
        </span>
        <span className="text-sm font-semibold text-ink">Anonymous Foodie</span>
        <VerifiedIcon className="h-4 w-4 text-rate-green" />
      </div>
    </div>
  );
}

function EarlierReviewCard({ review }: { review: ReviewItem }) {
  return (
    <div className="rounded-2xl border border-hairline bg-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RatingBadge score={review.rating} label={String(review.rating)} />
          <span className="text-sm font-semibold text-ink">Anonymous Foodie</span>
        </div>
        <ReviewerRow time={timeAgo(review.createdAt)} />
      </div>
      <p className="mt-2 text-[15px] leading-snug text-ink">{review.comment}</p>
    </div>
  );
}
