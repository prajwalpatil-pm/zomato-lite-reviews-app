import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

// POST /api/reviews  —  save one review.
//
// A contract: send { restaurantId, rating, comment } and get back
// { success, reviewId }. But the backend TRUSTS NOTHING. Anyone can call this
// directly with a terminal, without ever opening our app — so we re-check
// everything here, even things the UI already prevents.

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const { restaurantId, rating, comment } = (body ?? {}) as {
    restaurantId?: unknown;
    rating?: unknown;
    comment?: unknown;
  };

  // 1. rating must be a whole number from 1 to 5.
  //    (This is the check that stops a rating of 500 poisoning the average.)
  if (
    typeof rating !== "number" ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    return NextResponse.json(
      { error: "Rating must be a whole number between 1 and 5." },
      { status: 400 },
    );
  }

  // 2. comment must be a non-empty string once whitespace is trimmed.
  if (typeof comment !== "string" || comment.trim().length === 0) {
    return NextResponse.json(
      { error: "Comment cannot be empty." },
      { status: 400 },
    );
  }

  // 3. restaurantId must point at a restaurant that actually exists (a DB lookup).
  const exists =
    typeof restaurantId === "number" && Number.isInteger(restaurantId)
      ? await sql`SELECT id FROM restaurants WHERE id = ${restaurantId}`
      : [];
  if (exists.length === 0) {
    return NextResponse.json(
      { error: "That restaurant does not exist." },
      { status: 400 },
    );
  }

  // All checks passed: write exactly one row. Nothing else in the database
  // changes — no average is updated anywhere, because no average is stored.
  const [inserted] = await sql`
    INSERT INTO reviews (restaurant_id, rating, comment)
    VALUES (${restaurantId}, ${rating}, ${comment.trim()})
    RETURNING id`;

  return NextResponse.json(
    { success: true, reviewId: inserted.id },
    { status: 201 },
  );
}
