import type { NextConfig } from "next";

const BACKEND_URL =
  process.env.BACKEND_API_URL ??
  process.env.FORTSOLAR_API_BASE_URL ??
  process.env.NEXT_PUBLIC_FORTSOLAR_API_BASE_URL ??
  "https://api.fortsolar.ng";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      ...(process.env.NODE_ENV === "development"
        ? [
            { protocol: "http" as const, hostname: "localhost" },
            { protocol: "http" as const, hostname: "127.0.0.1" },
          ]
        : []),
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${BACKEND_URL}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
