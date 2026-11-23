import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Project imagery is still hosted on Base44 media storage (migrated content).
    remotePatterns: [new URL("https://media.base44.com/images/public/6b03e14baf639027c969822b/**")],
    formats: ["image/avif", "image/webp"],
    // Local visual QA only: lets the browser fetch remote images directly.
    unoptimized: process.env.LOCAL_QA === "1",
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
