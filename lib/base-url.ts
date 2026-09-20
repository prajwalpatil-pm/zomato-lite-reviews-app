import { headers } from "next/headers";

// Server components run on a server, so fetch() needs an absolute URL. Build
// it from the incoming request's host (works on localhost and on Vercel).
export async function apiBase(): Promise<string> {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto =
    h.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}
