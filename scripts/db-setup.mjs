// Applies db/schema.sql and db/seed.sql to the database, then prints the rows
// it created. Run it with:  npm run db:setup
//
// It is safe to run more than once: it drops the two tables first and rebuilds
// them from scratch, so you always get a clean, predictable starting point.
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set. Is .env present in the project root?");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

// Neon's HTTP driver runs one statement per call, so we split each .sql file
// on semicolons and run the statements in order.
function statements(file) {
  return readFileSync(join(root, file), "utf8")
    .split("\n")
    .map((line) => line.replace(/--.*$/, "")) // drop SQL line-comments first
    .join("\n")
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

async function run() {
  console.log("Connecting to the database...\n");

  console.log("Resetting (dropping reviews, then restaurants so this is re-runnable)...");
  await sql`DROP TABLE IF EXISTS reviews`;
  await sql`DROP TABLE IF EXISTS restaurants`;

  console.log("Applying db/schema.sql (creating the two tables)...");
  for (const stmt of statements("db/schema.sql")) {
    await sql.query(stmt);
  }

  console.log("Applying db/seed.sql (adding Ludhiana Burrito + 3 reviews)...\n");
  for (const stmt of statements("db/seed.sql")) {
    await sql.query(stmt);
  }

  const restaurants = await sql`SELECT id, name, cuisine, area FROM restaurants ORDER BY id`;
  const reviews = await sql`SELECT id, restaurant_id, rating, comment, created_at FROM reviews ORDER BY created_at`;

  console.log("restaurants table:");
  console.table(restaurants);
  console.log("\nreviews table:");
  console.table(
    reviews.map((r) => ({
      id: r.id,
      restaurant_id: r.restaurant_id,
      rating: r.rating,
      comment: r.comment,
      created_at: new Date(r.created_at).toISOString(),
    })),
  );

  console.log(
    "\nDone. Note the two columns that do NOT exist: average_rating and latest_review.",
  );
  console.log("Those are results, not facts — the backend computes them on every request.");
}

run().catch((err) => {
  console.error("\nSetup failed:", err.message);
  process.exit(1);
});
