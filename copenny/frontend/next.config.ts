import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",   // Static HTML export for free Render hosting
  trailingSlash: true, // Ensures clean URLs on static hosts
  images: {
    unoptimized: true, // Required for static export (no Next.js image server)
  },
};

export default nextConfig;
