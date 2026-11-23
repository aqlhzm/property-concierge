import type { Metadata } from "next";

/** Canonical site URL (set NEXT_PUBLIC_SITE_URL when a custom domain is added). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://property-concierge-ten.vercel.app").replace(/\/$/, "");

export const SITE_NAME = "PROPERTY CONCIERGE by aqilgotkeys";

/**
 * Full Open Graph block for a page. Next.js replaces (does not merge) a parent's
 * openGraph when a page sets its own, so every page gets the shared fields too.
 */
export function openGraph(image: string, alt: string): Metadata["openGraph"] {
  return {
    siteName: SITE_NAME,
    type: "website",
    locale: "en_MY",
    images: [{ url: image, width: 1200, height: 630, alt, type: "image/jpeg" }],
  };
}
