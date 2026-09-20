import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // There is an unrelated package.json in a parent folder; without this,
  // Next/Turbopack cannot tell which directory is the project root. Pin it here.
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
