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
      // All images: HD photography and floor plans on the owner's media storage
      new URL("https://d2ol7oe51mr4n9.cloudfront.net/user_2wyjxahmz9PtKeHoIbEemDKyafc/**"),
    ],
    qualities: [75, 85, 90],
    formats: ["image/avif", "image/webp"],
    // Local visual QA only: lets the browser fetch remote images directly.
    unoptimized: process.env.LOCAL_QA === "1",
  },
  // One address for everything: the old vercel.app address (and its query strings) moves to the custom domain.
  // aqilgotkeys.com without www is redirected to www by Vercel's domain settings.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "property-concierge-ten.vercel.app" }],
        destination: "https://www.aqilgotkeys.com/:path*",
        permanent: true,
      },
    ];
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
