import { apiBase } from "@/lib/base-url";
import type { RestaurantListItem } from "@/lib/types";
import { RestaurantList } from "@/app/_components/RestaurantList";

// Always fresh: a brand-new review changes a restaurant's average the moment
// you return here, because the list endpoint recomputes it every request.
export const dynamic = "force-dynamic";

export default async function Home() {
  // The landing page calls the list API and renders what it gets.
  const res = await fetch(`${await apiBase()}/api/restaurants`, {
    cache: "no-store",
  });
  const items: RestaurantListItem[] = res.ok ? await res.json() : [];
  return <RestaurantList items={items} />;
}
