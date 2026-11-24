import type { NextConfig } from "next";

const MEDIA = "https://d2ol7oe51mr4n9.cloudfront.net";

/**
 * Content Security Policy. Everything is served from this origin except photography and video on the media CDN.
 * Scripts allow 'unsafe-inline' because Next.js streams small inline bootstrap scripts and pages are prerendered
 * (a per-request nonce would turn every page dynamic). No third-party script origins are allowed at all.
 * Development keeps 'unsafe-eval' for React Refresh only.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${MEDIA}`,
  `media-src 'self' blob: ${MEDIA}`,
  "font-src 'self' data:",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
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
