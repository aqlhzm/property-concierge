import type { Project } from "@/data/types";

export type Budget = "any" | "under-1m" | "1m-1.3m" | "above-1.3m";

export const BUDGETS: { value: Budget; label: string }[] = [
  { value: "any", label: "Any budget" },
  { value: "under-1m", label: "From under RM1m" },
  { value: "1m-1.3m", label: "RM1m – RM1.3m" },
  { value: "above-1.3m", label: "Above RM1.3m" },
];

function haystack(p: Project) {
  return [p.name, p.productName, p.productLabel, p.propertyType, p.township, p.location, p.state, p.lotSize, ...p.facilities]
    .join(" ")
    .toLowerCase();
}

/** Matches if every word in the query appears somewhere in the project's searchable text. */
export function matchesQuery(p: Project, q: string) {
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return true;
  const text = haystack(p);
  return words.every((w) => text.includes(w));
}

/**
 * Budget uses the permit price range. Projects whose price is not verified (showPrice=false)
 * are kept in every budget and marked "pricing to be reconfirmed", so buyers are not misled either way.
 */
export function matchesBudget(p: Project, b: Budget) {
  if (b === "any" || !p.showPrice) return true;
  if (b === "under-1m") return p.priceMin < 1_000_000;
  if (b === "1m-1.3m") return p.priceMin <= 1_300_000 && p.priceMax >= 1_000_000;
  return p.priceMax > 1_300_000;
}
