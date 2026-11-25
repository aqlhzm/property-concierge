/**
 * Two languages: English at the site root (unchanged URLs) and Bahasa Melayu under /ms.
 * Safe to import from server and client code.
 */
export type Lang = "en" | "ms";

export const LANGS: Lang[] = ["en", "ms"];

/** BCP 47 tags for <html lang>, hreflang and Intl formatting */
export const LOCALE: Record<Lang, string> = { en: "en-MY", ms: "ms-MY" };

/** Open Graph locale */
export const OG_LOCALE: Record<Lang, string> = { en: "en_MY", ms: "ms_MY" };

const isMsPath = (path: string) => path === "/ms" || path.startsWith("/ms/") || path.startsWith("/ms?") || path.startsWith("/ms#");

export function langFromPath(pathname: string | null | undefined): Lang {
  return pathname && isMsPath(pathname) ? "ms" : "en";
}

/** The same page without any language prefix: /ms/projects -> /projects */
export function stripLang(path: string) {
  if (!isMsPath(path)) return path;
  const rest = path.slice(3);
  return rest === "" ? "/" : rest.startsWith("/") ? rest : `/${rest}`;
}

/**
 * Internal link for a language. Only site paths are rewritten; staff pages, external links and anchors are left alone.
 * lp("ms", "/projects?q=x") -> "/ms/projects?q=x"; lp("ms", "/") -> "/ms"
 */
export function lp(lang: Lang, path: string) {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  const base = stripLang(path);
  if (lang === "en" || base === "/admin" || base.startsWith("/admin/")) return base;
  if (base === "/") return "/ms";
  if (base.startsWith("/?") || base.startsWith("/#")) return `/ms${base.slice(1)}`;
  return `/ms${base}`;
}
