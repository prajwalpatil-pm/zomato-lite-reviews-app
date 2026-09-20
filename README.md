# Zomato Lite

A small food-discovery app: **browse restaurants**, open one to **read its reviews**,
and **write your own**. Small on purpose — the ideas inside are the same ones running
any real product.

## The one lesson: store facts, compute answers

The database stores **facts** (individual reviews). It has **no** `average_rating`
column and **no** `latest_review` column, because those are **results**, not facts.
The backend computes them fresh on every request with `AVG(rating)`, `COUNT(*)` and
`ORDER BY created_at DESC` — for a single restaurant *and* for every card in the list.
The frontend receives `4.3` and prints `4.3`; it never adds, divides or sorts.

## The three screens

1. **Restaurant list** (`/`) — the landing/Discover screen: search, filter pills, and a
   card per restaurant with its live average rating and review count.
2. **Restaurant detail** (`/restaurant/[id]`) — the average, the highlighted latest review,
   and the earlier ones.
3. **Write review** (`/review/[restaurantId]`) — a star picker + comment that posts to the API.

## Files that matter

| File | Layer | What it does |
| --- | --- | --- |
| `db/schema.sql` | database | The two tables. `restaurants` gains only an `image_url` fact — never a rating. |
| `db/seed.sql` | database | 4 restaurants + their reviews (photos hotlinked from Unsplash). |
| `scripts/db-setup.mjs` | database | `npm run db:setup` — resets + seeds, prints the rows. |
| `lib/db.ts` | config | The single Neon Postgres connection. |
| `app/api/restaurants/route.ts` | backend | `GET` — the list, each with computed average + count. |
| `app/api/restaurants/[id]/route.ts` | backend | `GET` — one restaurant: average, count, latest + the rest. |
| `app/api/reviews/route.ts` | backend | `POST` — validates rating, comment, restaurant, then inserts one row. |
| `app/page.tsx` + `app/_components/RestaurantList.tsx` | frontend | The list screen (server fetch + client search/filter). |
| `app/restaurant/[id]/page.tsx` | frontend | Detail screen. Calls the API, renders it, zero maths. |
| `app/review/[restaurantId]/*` | frontend | The star picker + comment box; posts to the API. |

## Run it locally

```bash
npm install
npm run db:setup   # creates the tables and seeds them (reads DATABASE_URL from .env)
npm run dev        # http://localhost:3000
```

`DATABASE_URL` lives in `.env`, which is git-ignored — a secret must never go into Git.

## Why the backend re-checks everything

The star picker only offers 1–5, but anyone can call the API directly. So the backend
rejects a rating of 500 even though the UI can't produce one. Frontend validation is
kindness; backend validation is safety.

```bash
curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{"restaurantId":1,"rating":500,"comment":"hacked"}'
# -> 400 {"error":"Rating must be a whole number between 1 and 5."}
```

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Neon Postgres via
`@neondatabase/serverless` · raw SQL, no ORM · Material Symbols icons · deployed on Vercel.
See `DEPLOY.md` for deployment. The only thing that changes in production is `DATABASE_URL`,
set in the Vercel project's Environment Variables.
