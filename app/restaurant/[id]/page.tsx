import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReviewItem, RestaurantView } from "@/lib/types";
import { timeAgo, initials } from "@/lib/format";
import { apiBase } from "@/lib/base-url";
import { Sym } from "@/app/_components/sym";
import { BetaBadge, RatingChip } from "@/app/_components/ui";
import { ratingTierClasses } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function RestaurantPage({
  params,
}: PageProps<"/restaurant/[id]">) {
  const { id } = await params;

  // THIS PAGE CALLS THE API AND RENDERS WHAT IT GETS — no averaging, counting
  // or sorting in this file. The backend already did all of it.
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
      <header className="sticky top-0 z-30 bg-surface-container-lowest/90 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              aria-label="Go back"
              className="-ml-2 flex h-11 w-11 items-center justify-center text-on-surface transition-colors hover:text-primary"
            >
              <Sym name="arrow_back" className="text-[24px]" />
            </Link>
            <span className="truncate text-lg font-semibold text-on-surface">
              Restaurant Detail
            </span>
          </div>
          <BetaBadge />
        </div>
      </header>

      <main className="flex-1 px-4 pb-24 pt-3">
        {/* Hero + info card */}
        <div className="mb-4 overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
          {/* Red banner with monogram */}
          <div className="relative flex h-[108px] items-center justify-center overflow-hidden bg-primary">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-around opacity-10">
              <Sym name="lunch_dining" className="text-[64px] text-on-primary" />
              <Sym name="local_fire_department" className="text-[64px] text-on-primary" />
              <Sym name="restaurant" className="text-[64px] text-on-primary" />
            </div>
            <div className="relative z-10 flex items-center justify-center rounded-xl bg-on-primary/20 px-5 py-2 backdrop-blur-md">
              <span className="text-[28px] font-extrabold tracking-widest text-on-primary">
                {initials(r.name)}
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 flex-col">
                <h1 className="truncate text-[22px] font-bold text-on-surface">
                  {r.name}
                </h1>
                <div className="mt-1 flex items-center gap-1 text-on-surface-variant">
                  <Sym name="location_on" className="text-[16px]" />
                  <span className="text-xs">{r.area}</span>
                </div>
              </div>
              {r.averageRating === null ? (
                <span className="shrink-0 rounded-lg bg-surface-container px-3 py-1.5 text-sm font-bold text-on-surface-variant">
                  New
                </span>
              ) : (
                <span
                  className={`flex shrink-0 items-center gap-1 rounded-lg px-3 py-1.5 shadow-sm ${ratingTierClasses(
                    r.averageRating,
                  )}`}
                >
                  <span className="text-sm font-bold">
                    {r.averageRating.toFixed(1)}
                  </span>
                  <span className="text-[11px] font-semibold opacity-80">/5</span>
                  <Sym name="star" fill className="text-[14px]" />
                </span>
              )}
            </div>

            {/* Cuisine pills */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1 rounded-full bg-surface-container-high px-3 py-1 text-xs font-semibold text-on-surface">
                <Sym name="ramen_dining" className="text-[14px] text-primary" />
                {r.cuisine}
              </span>
              <span className="flex items-center gap-1 rounded-full bg-surface-container-high px-3 py-1 text-xs font-semibold text-on-surface">
                <Sym name="table_restaurant" className="text-[14px] text-secondary" />
                Dine-in
              </span>
              <span className="flex items-center gap-1 rounded-full bg-surface-container-high px-3 py-1 text-xs font-semibold text-on-surface-variant">
                <Sym name="takeout_dining" className="text-[14px]" />
                Delivery
              </span>
            </div>

            {/* Social proof */}
            <div className="mt-3 flex items-center justify-between rounded-lg bg-surface-container-low/60 p-2">
              <div className="flex items-center gap-1.5 text-on-surface-variant">
                <Sym name="rate_review" className="text-[16px] text-primary" />
                <span className="text-xs">
                  {hasReviews
                    ? `Based on ${r.totalReviews} customer ${r.totalReviews === 1 ? "review" : "reviews"}`
                    : "No reviews yet"}
                </span>
              </div>
              {hasReviews && (
                <span className="rounded bg-secondary-container/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-secondary">
                  Verified
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Latest review */}
        {r.latestReview && (
          <div className="mb-4 flex flex-col">
            <div className="mb-1 flex items-center justify-between px-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                Latest Review
              </span>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary" />
              </span>
            </div>
            <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-4 shadow-sm">
              <div className="absolute bottom-0 left-0 top-0 w-1.5 bg-secondary" />
              <div className="pl-2">
                <div className="mb-2 flex items-center justify-between">
                  <span className="rounded-full bg-secondary-container px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-on-secondary-container">
                    Latest
                  </span>
                  <div className="flex items-center gap-1 text-on-surface-variant">
                    <Sym name="schedule" className="text-[13px]" />
                    <span className="text-xs">{timeAgo(r.latestReview.createdAt)}</span>
                  </div>
                </div>
                <div className="my-1 flex items-start gap-2">
                  <span className="mt-0.5 shrink-0">
                    <RatingChip
                      score={r.latestReview.rating}
                      label={String(r.latestReview.rating)}
                    />
                  </span>
                  <p className="text-sm font-medium leading-snug text-on-surface">
                    {r.latestReview.comment}
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-2 pt-1">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-fixed text-[10px] font-bold text-on-primary-fixed">
                    A
                  </span>
                  <span className="text-xs text-on-surface-variant">Anonymous Foodie</span>
                  <Sym name="verified" className="ml-auto text-[14px] text-secondary" fill />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Earlier reviews */}
        {r.reviews.length > 0 && (
          <div className="mb-3 flex flex-col">
            <div className="mb-1 flex items-center justify-between px-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                Earlier Reviews
              </span>
              <span className="text-[10px] font-semibold text-on-surface-variant">
                {r.reviews.length} older
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {r.reviews.map((review) => (
                <EarlierReview key={review.id} review={review} />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!hasReviews && (
          <div className="rounded-xl border border-dashed border-surface-container-highest bg-surface-container-lowest px-4 py-10 text-center shadow-sm">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-fixed text-primary">
              <Sym name="reviews" className="text-[26px]" />
            </span>
            <p className="mt-3 font-bold text-on-surface">No reviews yet</p>
            <p className="mt-1 text-sm text-on-surface-variant">
              Be the first to review {r.name}.
            </p>
          </div>
        )}
      </main>

      {/* Sticky action bar */}
      <div className="sticky bottom-0 z-30 bg-surface-container-lowest/95 p-4 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] backdrop-blur-md">
        <Link
          href={`/review/${id}`}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-container active:scale-[0.98]"
        >
          <Sym name="edit_note" className="text-[20px]" />
          Write a Review
        </Link>
      </div>
    </>
  );
}

function EarlierReview({ review }: { review: ReviewItem }) {
  return (
    <div className="rounded-xl bg-surface-container-lowest p-3 shadow-sm">
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RatingChip score={review.rating} label={String(review.rating)} />
          <span className="text-xs font-semibold text-on-surface">Anonymous Foodie</span>
        </div>
        <span className="text-xs text-on-surface-variant">{timeAgo(review.createdAt)}</span>
      </div>
      <p className="mt-1 pl-0.5 text-sm leading-relaxed text-on-surface">{review.comment}</p>
    </div>
  );
}
