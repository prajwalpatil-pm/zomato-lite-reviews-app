import { redirect } from "next/navigation";

// This app is about one restaurant, so the home page just sends you straight
// to its page. (The guide deliberately has no restaurant-listing screen.)
export default function Home() {
  redirect("/restaurant/1");
}
