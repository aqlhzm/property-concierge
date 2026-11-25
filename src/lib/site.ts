import type { Metadata } from "next";
import { lp, OG_LOCALE, type Lang } from "@/i18n/config";

/** Canonical site URL: the custom domain (aqilgotkeys.com redirects to www). Override with NEXT_PUBLIC_SITE_URL. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aqilgotkeys.com").replace(/\/$/, "");

/** Hosts this site is served on. Used to build sign-in links on the host the visitor is actually using. */
export const KNOWN_HOSTS = ["www.aqilgotkeys.com", "aqilgotkeys.com", "property-concierge-ten.vercel.app"];

export const SITE_NAME = "PROPERTY CONCIERGE by aqilgotkeys";

/**
 * Full Open Graph block for a page. Next.js replaces (does not merge) a parent's
 * openGraph when a page sets its own, so every page gets the shared fields too.
 */
export function openGraph(image: string, alt: string, lang: Lang = "en"): Metadata["openGraph"] {
  return {
    siteName: SITE_NAME,
    type: "website",
    locale: OG_LOCALE[lang],
    alternateLocale: OG_LOCALE[lang === "en" ? "ms" : "en"],
    images: [{ url: image, width: 1200, height: 630, alt, type: "image/jpeg" }],
  };
}

/** Canonical and hreflang links for a page that exists in both languages. path is the English path, e.g. "/projects". */
export function alternates(lang: Lang, path: string): Metadata["alternates"] {
  return {
    canonical: lp(lang, path),
    languages: { "en-MY": lp("en", path), "ms-MY": lp("ms", path), "x-default": lp("en", path) },
  };
}
