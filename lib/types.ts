// The exact shapes the backend hands to the frontend. Each is shaped like the
// screen that consumes it, so the frontend has nothing left to compute.

export type ReviewItem = {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
};

// One row in the restaurant-list (landing) screen.
export type RestaurantListItem = {
  id: number;
  name: string;
  cuisine: string;
  area: string;
  imageUrl: string | null;
  averageRating: number | null; // computed: AVG(rating), 1 dp
  totalReviews: number; // computed: COUNT(*)
};

// Everything the restaurant-detail screen needs.
export type RestaurantView = {
  name: string;
  cuisine: string;
  area: string;
  imageUrl: string | null;
  averageRating: number | null; // computed: AVG(rating), 1 dp. null when no reviews.
  totalReviews: number; // computed: COUNT(*)
  latestReview: ReviewItem | null; // computed: newest by created_at
  reviews: ReviewItem[]; // every review EXCEPT the latest, newest first
};
