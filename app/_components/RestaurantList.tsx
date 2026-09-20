"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Sym } from "./sym";
import { BetaBadge } from "./ui";
import { ratingTierClasses } from "@/lib/format";
import type { RestaurantListItem } from "@/lib/types";

// Decorative, deterministic per-card chrome (delivery time / distance) so the
// feed looks like a real listing. These are NOT stored facts — just presentation.
const ETA = ["25-30 min", "20-25 min", "30-40 min", "15-20 min"];
const DIST = ["1.2 km away", "2.8 km away", "3.5 km away", "0.9 km away"];

function tierTag(avg: number | null) {
  if (avg === null)
    return { label: "New", cls: "bg-surface-container text-on-surface-variant" };
  if (avg >= 4.5)
    return { label: "Iconic", cls: "bg-secondary-container text-on-secondary-fixed-variant" };
  if (avg >= 4.0)
    return { label: "Top Rated", cls: "bg-tertiary-fixed text-on-tertiary-fixed" };
  return { label: "Local Pick", cls: "bg-surface-container text-on-surface-variant" };
}

export function RestaurantList({ items }: { items: RestaurantListItem[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [favs, setFavs] = useState<Record<number, boolean>>({});

  // Build the filter pills: All, Top Rated, then one per sector in the data.
  const sectors = useMemo(
    () => Array.from(new Set(items.map((i) => i.area))),
    [items],
  );

  const visible = items.filter((r) => {
    const q = query.trim().toLowerCase();
    const matchesSearch =
      !q ||
      r.name.toLowerCase().includes(q) ||
      r.cuisine.toLowerCase().includes(q) ||
      r.area.toLowerCase().includes(q);
    let matchesFilter = true;
    if (filter === "top-rated") matchesFilter = (r.averageRating ?? 0) >= 4.0;
    else if (filter !== "all") matchesFilter = r.area === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-30 bg-surface-container-lowest/90 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-baseline gap-0.5">
            <span className="text-[22px] font-extrabold lowercase tracking-tight text-primary">
              zomato
            </span>
            <span className="text-lg font-medium tracking-tight text-on-surface-variant">
              -lite
            </span>
          </div>
          <div className="flex items-center gap-2">
            <BetaBadge />
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-on-primary">
              <Sym name="person" className="text-[18px]" />
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 pb-24">
        {/* Search */}
        <section className="px-4 pb-2 pt-3">
          <div className="relative flex items-center">
            <span className="pointer-events-none absolute left-3 text-primary">
              <Sym name="search" className="text-[20px]" />
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dishes, sectors, or cravings..."
              className="h-11 w-full rounded-xl bg-surface-container-lowest pl-10 pr-10 text-sm text-on-surface shadow-sm outline-none transition placeholder:text-outline focus:bg-surface-container-low"
            />
            {query && (
              <button
                aria-label="Clear search"
                onClick={() => setQuery("")}
                className="absolute right-2 rounded-full p-1 text-outline transition active:scale-95"
              >
                <Sym name="close" className="text-[18px]" />
              </button>
            )}
          </div>

          {/* Filter pills */}
          <div className="scrollbar-none flex items-center gap-1.5 overflow-x-auto py-2">
            <FilterPill active={filter === "all"} onClick={() => setFilter("all")}>
              All
            </FilterPill>
            <FilterPill
              active={filter === "top-rated"}
              onClick={() => setFilter("top-rated")}
            >
              <Sym name="star" className="text-[14px] text-tertiary" fill />
              Top Rated
            </FilterPill>
            {sectors.map((s) => (
              <FilterPill key={s} active={filter === s} onClick={() => setFilter(s)}>
                {s}
              </FilterPill>
            ))}
          </div>
        </section>

        {/* Section header */}
        <div className="mb-2 mt-1 flex items-center justify-between px-4">
          <div className="flex items-center gap-1.5">
            <span className="h-3.5 w-1.5 rounded-full bg-primary" />
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-outline">
              Featured Places
            </h2>
          </div>
          <span className="rounded-full bg-primary-fixed/50 px-2 py-0.5 text-[10px] font-semibold text-primary">
            {visible.length} curated {visible.length === 1 ? "gem" : "gems"}
          </span>
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-3 px-4 pb-4">
          {visible.map((r, idx) => {
            const tag = tierTag(r.averageRating);
            const fav = !!favs[r.id];
            return (
              <article
                key={r.id}
                onClick={() => router.push(`/restaurant/${r.id}`)}
                className="flex cursor-pointer flex-col rounded-xl bg-surface-container-lowest p-4 shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.99]"
              >
                {/* Header row */}
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <h3 className="truncate text-lg font-bold tracking-tight text-on-surface">
                        {r.name}
                      </h3>
                      <span
                        className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold ${tag.cls}`}
                      >
                        {tag.label}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-sm text-on-surface-variant">
                      {r.area} • {r.cuisine}
                    </p>
                  </div>
                  {r.averageRating === null ? (
                    <span className="shrink-0 rounded-lg bg-surface-container px-2.5 py-1 text-xs font-bold text-on-surface-variant">
                      New
                    </span>
                  ) : (
                    <span
                      className={`flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold shadow-sm ${ratingTierClasses(
                        r.averageRating,
                      )}`}
                    >
                      {r.averageRating.toFixed(1)}
                      <Sym name="star" fill className="text-[13px]" />
                    </span>
                  )}
                </div>

                {/* Image */}
                <div className="relative mb-3 h-40 w-full overflow-hidden rounded-xl bg-surface-container">
                  {r.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={r.imageUrl}
                      alt={r.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <span className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded bg-surface-container-lowest/95 px-2 py-0.5 text-[10px] font-bold text-on-surface shadow-sm backdrop-blur-md">
                    <Sym name="schedule" className="text-[12px] text-primary" />
                    {ETA[idx % ETA.length]}
                  </span>
                  <button
                    aria-label="Save to favorites"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFavs((f) => ({ ...f, [r.id]: !f[r.id] }));
                    }}
                    className={`absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-lowest/90 shadow-sm backdrop-blur-md transition active:scale-90 ${
                      fav ? "text-primary" : "text-outline"
                    }`}
                  >
                    <Sym name="favorite" fill={fav} className="text-[18px]" />
                  </button>
                  <div className="absolute bottom-2 left-2.5 flex items-center gap-1 text-[10px] font-bold text-white">
                    <Sym name="near_me" className="text-[14px]" />
                    {DIST[idx % DIST.length]}
                  </div>
                </div>

                {/* Footer */}
                <div className="-mx-4 -mb-4 mt-1 flex items-center justify-between rounded-b-xl bg-surface-container-low px-4 py-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant">
                    <Sym name="reviews" className="text-[15px] text-outline" />
                    <span>
                      {r.totalReviews > 0
                        ? `Based on ${r.totalReviews} ${r.totalReviews === 1 ? "review" : "reviews"}`
                        : "No reviews yet"}
                    </span>
                  </div>
                  <span className="flex items-center gap-0.5 text-xs font-semibold text-primary">
                    View Reviews
                    <Sym name="arrow_forward" className="text-[16px]" />
                  </span>
                </div>
              </article>
            );
          })}

          {visible.length === 0 && (
            <div className="my-3 flex flex-col items-center justify-center rounded-xl bg-surface-container-lowest p-6 text-center shadow-sm">
              <span className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-primary-fixed text-primary">
                <Sym name="search_off" className="text-[28px]" />
              </span>
              <h3 className="text-lg font-bold text-on-surface">No cravings found</h3>
              <p className="mt-1 max-w-[240px] text-xs text-on-surface-variant">
                Try resetting filters or searching for another sector.
              </p>
              <button
                onClick={() => {
                  setQuery("");
                  setFilter("all");
                }}
                className="mt-3 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-on-primary shadow-sm active:scale-95"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Bottom nav (Discover active; Saved/Activity are visual) */}
      <nav className="sticky bottom-0 z-30 bg-surface-container-lowest/90 shadow-[0_-2px_10px_rgba(0,0,0,0.04)] backdrop-blur-xl">
        <div className="flex h-16 items-center justify-around px-1">
          <NavItem icon="explore" label="Discover" active />
          <NavItem icon="bookmark" label="Saved" />
          <NavItem icon="receipt_long" label="Activity" />
        </div>
      </nav>
    </>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold shadow-sm transition active:scale-95 ${
        active
          ? "bg-primary-fixed font-bold text-primary"
          : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low"
      }`}
    >
      {children}
    </button>
  );
}

function NavItem({
  icon,
  label,
  active = false,
}: {
  icon: string;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`flex min-h-[44px] min-w-[56px] flex-col items-center justify-center gap-0.5 transition-colors ${
        active ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
      }`}
    >
      <Sym name={icon} className="text-[22px]" fill={active} />
      <span className="text-[10px] font-semibold">{label}</span>
    </button>
  );
}
