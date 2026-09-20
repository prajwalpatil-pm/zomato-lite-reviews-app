// The database connection — the ONE place the whole app talks to Postgres.
//
// We use Neon's serverless driver, which speaks to Postgres over HTTP. That
// makes it work perfectly on Vercel, where our backend runs as short-lived
// functions rather than one long-running server.
//
// `sql` is a tagged-template function. You write real SQL and drop values in
// with ${...}; the driver safely turns those into bound parameters, so a
// comment like "5); DROP TABLE reviews;--" can never become a command.
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  // If this throws on Vercel, it means DATABASE_URL was never added to the
  // project's Environment Variables. The build succeeds; the page breaks.
  throw new Error(
    "DATABASE_URL is not set. Add it to .env locally, or to your Vercel project settings in production.",
  );
}

export const sql = neon(process.env.DATABASE_URL);
