import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import type { ReviewItem, RestaurantView } from "@/lib/types";

// GET /api/restaurants/[id]  —  everything the restaurant page needs, in one call.
//
// "Store facts, compute answers": the database holds raw reviews; the average,
// the count and "the latest one" are all worked out HERE, fresh, every request.

type RawReviewRow = {
  id: number;
  rating: number;
  comment: string;
  created_at: string | Date;
};

function toReviewItem(r: RawReviewRow): ReviewItem {
  return {
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    createdAt: new Date(r.created_at).toISOString(),
  };
}

export async function GET(
  _req: Request,
  ctx: RouteContext<"/api/restaurants/[id]">,
) {
  const { id } = await ctx.params;
  const restaurantId = Number(id);

  const found = Number.isInteger(restaurantId)
    ? await sql`SELECT id, name, cuisine, area, image_url FROM restaurants WHERE id = ${restaurantId}`
    : [];
  if (found.length === 0) {
    return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
  }
  const restaurant = found[0];

  // COMPUTED right now from the raw rows: AVG(rating) and COUNT(*).
  const [stats] = await sql`
    SELECT AVG(rating) AS avg, COUNT(*) AS count
    FROM reviews
    WHERE restaurant_id = ${restaurantId}`;

  const totalReviews = Number(stats.count);
  const averageRating =
    stats.avg === null ? null : Math.round(Number(stats.avg) * 10) / 10;

  // Newest first. The single newest is "latest"; everything after it is "the
  // rest", so the page never prints the latest review twice.
  const ordered = (await sql`
    SELECT id, rating, comment, created_at
    FROM reviews
    WHERE restaurant_id = ${restaurantId}
    ORDER BY created_at DESC`) as RawReviewRow[];

  const latestReview = ordered.length > 0 ? toReviewItem(ordered[0]) : null;
  const reviews = ordered.slice(1).map(toReviewItem);

  const body: RestaurantView = {
    name: restaurant.name,
    cuisine: restaurant.cuisine,
    area: restaurant.area,
    imageUrl: restaurant.image_url ?? null,
    averageRating,
    totalReviews,
    latestReview,
    reviews,
  };

  return NextResponse.json(body);
}
