import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import type { RestaurantListItem } from "@/lib/types";

// GET /api/restaurants  —  the list for the landing (Discover) screen.
//
// Same lesson as the detail endpoint: each restaurant's average rating and
// review count are COMPUTED here from the raw reviews (one LEFT JOIN + GROUP BY),
// never stored. A restaurant with no reviews comes back with null / 0.

type RawListRow = {
  id: number;
  name: string;
  cuisine: string;
  area: string;
  image_url: string | null;
  avg: string | null;
  count: string;
};

export async function GET() {
  const rows = (await sql`
    SELECT r.id, r.name, r.cuisine, r.area, r.image_url,
           AVG(rv.rating) AS avg,
           COUNT(rv.id)   AS count
    FROM restaurants r
    LEFT JOIN reviews rv ON rv.restaurant_id = r.id
    GROUP BY r.id, r.name, r.cuisine, r.area, r.image_url
    ORDER BY r.id`) as RawListRow[];

  const list: RestaurantListItem[] = rows.map((r) => ({
    id: r.id,
    name: r.name,
    cuisine: r.cuisine,
    area: r.area,
    imageUrl: r.image_url ?? null,
    averageRating: r.avg === null ? null : Math.round(Number(r.avg) * 10) / 10,
    totalReviews: Number(r.count),
  }));

  return NextResponse.json(list);
}
