// The exact shape the backend hands to the frontend. Notice it is shaped like
// the screen: name, the big rating, the latest review, then the rest. The
// frontend has nothing left to figure out — it just renders these fields.

export type ReviewItem = {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
};

export type RestaurantView = {
  name: string;
  cuisine: string;
  area: string;
  averageRating: number | null; // computed: AVG(rating), rounded to 1 dp. null when there are no reviews.
  totalReviews: number; // computed: COUNT(*)
  latestReview: ReviewItem | null; // computed: newest by created_at
  reviews: ReviewItem[]; // every review EXCEPT the latest, newest first
};
