import type { Lang } from "@/i18n/config";

const rm = new Intl.NumberFormat("en-MY", { style: "currency", currency: "MYR", maximumFractionDigits: 0 });
const num = new Intl.NumberFormat("en-MY", { maximumFractionDigits: 0 });

/** Money and numbers keep the Malaysian format (RM781,200) in both languages */
export const formatRM = (n: number) => rm.format(Math.round(n)).replace("MYR", "RM").replace(/\s/g, "");
export const formatNum = (n: number) => num.format(n);

/** Compact price for cards: RM781k, RM1.25m (BM: RM1.25 juta) */
export function formatRMShort(n: number, lang: Lang = "en") {
  if (n >= 1_000_000) return `RM${(n / 1_000_000).toFixed(2).replace(/\.?0+$/, "")}${lang === "ms" ? " juta" : "m"}`;
  if (n >= 1_000) return `RM${Math.round(n / 1_000)}k`;
  return `RM${n}`;
}

export function sqftRange(min: number, max: number, lang: Lang = "en") {
  return min === max ? `${formatNum(min)} sq ft` : `${formatNum(min)} ${lang === "ms" ? "hingga" : "to"} ${formatNum(max)} sq ft`;
}

export function formatDate(iso: string | null, lang: Lang = "en") {
  if (!iso) return lang === "ms" ? "Tidak dinyatakan" : "Not stated";
  return new Date(`${iso}T00:00:00+08:00`).toLocaleDateString(lang === "ms" ? "ms-MY" : "en-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kuala_Lumpur",
  });
}
