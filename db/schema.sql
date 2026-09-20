-- The shape of our database. Two tables. That is the whole product.
--
-- Look closely at what is NOT here:
--   * there is no average_rating column on restaurants
--   * there is no latest_review column
-- Those are not facts, they are results. We store facts and compute results
-- on demand (see the GET endpoint). If we stored an average, we'd have to
-- update it on every new review — and the day we forgot, the app would lie.

CREATE TABLE restaurants (
  id        SERIAL PRIMARY KEY,
  name      TEXT NOT NULL,
  cuisine   TEXT NOT NULL,
  area      TEXT NOT NULL
);

CREATE TABLE reviews (
  id            SERIAL PRIMARY KEY,
  restaurant_id INTEGER NOT NULL REFERENCES restaurants(id),
  rating        INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment       TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
