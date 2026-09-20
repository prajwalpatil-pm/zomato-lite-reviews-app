import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// Plus Jakarta Sans is the single typeface across the whole app (per the UI
// reference). next/font downloads and self-hosts it, so there is no flash of
// an unstyled font and nothing to load from a third party at runtime.
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zomato Lite",
  description:
    "Write a review, see the restaurant page. Two screens, two APIs, two tables.",
};

export const viewport: Viewport = {
  themeColor: "#e23744",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full`}>
      <body className="min-h-dvh bg-backdrop">
        {/* The mobile "stage": a phone-width column centred on larger screens. */}
        <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-canvas shadow-[0_0_50px_rgba(0,0,0,0.07)]">
          {children}
        </div>
      </body>
    </html>
  );
}
