import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "placeholder.com",
        protocol: "https",
      },
      {
        hostname: "example.com",
        protocol: "https",
      },
      {
        hostname: "unsplash.com",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
