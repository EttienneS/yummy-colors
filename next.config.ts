import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone mode for Docker deployment
  output: "standalone",

  // Optimize for production
  experimental: {
    // Reduce bundle size
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
