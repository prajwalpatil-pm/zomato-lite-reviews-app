import Link from "next/link";
import { notFound } from "next/navigation";
import { sql } from "@/lib/db";
import { initials } from "@/lib/format";
import { Sym } from "@/app/_components/sym";
import { BetaBadge } from "@/app/_components/ui";
import { ReviewForm } from "./ReviewForm";

export const dynamic = "force-dynamic";

export default async function ReviewPage({
  params,
}: PageProps<"/review/[restaurantId]">) {
  const { restaurantId } = await params;
  const id = Number(restaurantId);

  // Server component (runs on the backend): read the name + photo directly.
  const found = Number.isInteger(id)
    ? await sql`SELECT name, image_url FROM restaurants WHERE id = ${id}`
    : [];
  if (found.length === 0) notFound();
  const name: string = found[0].name;
  const imageUrl: string | null = found[0].image_url ?? null;

  return (
    <>
      <header className="sticky top-0 z-30 bg-surface-container-lowest/90 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Link
              href={`/restaurant/${id}`}
              aria-label="Go back"
              className="-ml-2 flex h-11 w-11 items-center justify-center text-on-surface transition-colors hover:text-primary"
            >
              <Sym name="arrow_back" className="text-[24px]" />
            </Link>
            <span className="truncate text-lg font-semibold text-on-surface">
              Write Review
            </span>
          </div>
          <BetaBadge />
        </div>
      </header>

      <main className="flex-1 px-4 pb-8">
        <div className="pb-2 pt-3">
          <Link
            href={`/restaurant/${id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-on-surface-variant transition-colors hover:text-primary"
          >
            <Sym name="arrow_back" className="text-[18px]" />
            Back to {name}
          </Link>
        </div>

        <div className="mb-3 mt-1 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
              Writing a review for
            </span>
            <h1 className="mt-0.5 truncate text-[22px] font-bold text-on-surface">
              {name}
            </h1>
          </div>
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-surface-container-high shadow-sm">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-sm font-extrabold text-primary">
                {initials(name)}
              </span>
            )}
          </div>
        </div>

        <ReviewForm restaurantId={id} restaurantName={name} />
      </main>
    </>
  );
}
