import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zomato Lite",
  description: "Discover restaurants, read reviews, and write your own.",
};

export const viewport: Viewport = {
  themeColor: "#b7122a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full`}>
      <body className="min-h-dvh">
        {/* Google Material Symbols icon font (used across all screens). */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
        {/* The mobile "stage": a phone-width column centred on larger screens. */}
        <div className="relative mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-surface shadow-[0_0_50px_rgba(0,0,0,0.08)]">
          {children}
        </div>
      </body>
    </html>
  );
}
