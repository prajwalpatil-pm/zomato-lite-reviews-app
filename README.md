# Zomato Lite

One restaurant, two things to do: **write a review** and **see the restaurant page**.
Small on purpose — the ideas inside are the same ones running any real product.

## The one lesson: store facts, compute answers

The database stores **facts** (individual reviews). It has **no** `average_rating`
column and **no** `latest_review` column, because those are **results**, not facts.
The backend computes them fresh on every request with `AVG(rating)`, `COUNT(*)` and
`ORDER BY created_at DESC`. The frontend receives `4.3` and prints `4.3` — it never
adds, divides or sorts.

## The five layers

| File | Layer | What it does |
| --- | --- | --- |
| `db/schema.sql` | database | The two tables. No computed columns, on purpose. |
| `db/seed.sql` | database | Ludhiana Burrito + 3 starter reviews. |
| `scripts/db-setup.mjs` | database | `npm run db:setup` — resets + seeds the DB, prints the rows. |
| `lib/db.ts` | config | The single Neon Postgres connection. |
| `lib/types.ts`, `lib/format.ts` | shared | The API shape; display-only helpers (colour, "2d ago"). |
| `app/api/reviews/route.ts` | backend | `POST` — validates rating, comment, restaurant, then inserts one row. |
| `app/api/restaurants/[id]/route.ts` | backend | `GET` — computes average, count, latest + the rest. |
| `app/restaurant/[id]/page.tsx` | frontend | Calls the GET API and renders it. Zero maths here. |
| `app/review/[restaurantId]/page.tsx` + `ReviewForm.tsx` | frontend | The star picker + comment box; posts to the API. |

## Run it locally

```bash
npm install
npm run db:setup   # creates the tables and seeds them (reads DATABASE_URL from .env)
npm run dev        # http://localhost:3000  -> redirects to /restaurant/1
```

`DATABASE_URL` lives in `.env`, which is git-ignored — a secret must never go into Git.

## Why the backend re-checks everything

The star picker only offers 1–5, but anyone can call the API directly from a terminal.
So the backend rejects a rating of 500 even though the UI can't produce one. Frontend
validation is kindness; backend validation is safety. Try it:

```bash
curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{"restaurantId":1,"rating":500,"comment":"hacked"}'
# -> 400 {"error":"Rating must be a whole number between 1 and 5."}
```

## Deploy (GitHub + Vercel)

See `DEPLOY.md` for copy-paste steps. The only thing that ever changes in production
is where the database lives: add `DATABASE_URL` in the Vercel project's Environment
Variables (same value as your local `.env`). Skip that and the build succeeds but the
site breaks — that is the classic "works on my machine" lesson.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Neon Postgres via
`@neondatabase/serverless` · raw SQL, no ORM · deployed on Vercel.
