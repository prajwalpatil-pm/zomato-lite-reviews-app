import Link from "next/link";
import { notFound } from "next/navigation";
import { sql } from "@/lib/db";
import { BetaBadge } from "@/app/_components/ui";
import { ArrowLeftIcon } from "@/app/_components/icons";
import { initials } from "@/lib/format";
import { ReviewForm } from "./ReviewForm";

export const dynamic = "force-dynamic";

export default async function ReviewPage({
  params,
}: PageProps<"/review/[restaurantId]">) {
  const { restaurantId } = await params;
  const id = Number(restaurantId);

  // This is a server component (it runs on the backend), so it can read the
  // database directly just to get the restaurant's name for the heading.
  const found = Number.isInteger(id)
    ? await sql`SELECT name FROM restaurants WHERE id = ${id}`
    : [];
  if (found.length === 0) notFound();
  const name: string = found[0].name;

  return (
    <>
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-hairline bg-card px-4 py-3">
        <div className="flex items-center gap-2">
          <Link
            href={`/restaurant/${id}`}
            aria-label="Back"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink transition active:scale-90"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <span className="text-lg font-extrabold text-ink">Write Review</span>
        </div>
        <BetaBadge />
      </header>

      <main className="flex-1 px-4 pb-8">
        <Link
          href={`/restaurant/${id}`}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-2 transition active:scale-95"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to {name}
        </Link>

        <div className="mt-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-ink-3">
              Writing a review for
            </p>
            <h1 className="mt-1 text-2xl font-extrabold leading-tight text-ink">
              {name}
            </h1>
          </div>
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-tint text-xl font-extrabold text-brand">
            {initials(name)}
          </span>
        </div>

        <ReviewForm restaurantId={id} restaurantName={name} />
      </main>
    </>
  );
}
