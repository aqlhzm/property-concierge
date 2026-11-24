import type { Metadata } from "next";

/** Canonical site URL: the custom domain (aqilgotkeys.com redirects to www). Override with NEXT_PUBLIC_SITE_URL. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aqilgotkeys.com").replace(/\/$/, "");

/** Hosts this site is served on. Used to build sign-in links on the host the visitor is actually using. */
export const KNOWN_HOSTS = ["www.aqilgotkeys.com", "aqilgotkeys.com", "property-concierge-ten.vercel.app"];

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
