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
    remotePatterns: [
      // Floor plans (migrated from Base44)
      new URL("https://media.base44.com/images/public/6b03e14baf639027c969822b/**"),
      // HD photography (upscaled, owner's Higgsfield media storage)
      new URL("https://d2ol7oe51mr4n9.cloudfront.net/user_2wyjxahmz9PtKeHoIbEemDKyafc/**"),
    ],
    qualities: [75, 85],
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
