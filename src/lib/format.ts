const rm = new Intl.NumberFormat("en-MY", { style: "currency", currency: "MYR", maximumFractionDigits: 0 });
const num = new Intl.NumberFormat("en-MY", { maximumFractionDigits: 0 });

export const formatRM = (n: number) => rm.format(Math.round(n)).replace("MYR", "RM").replace(/ /g, "");
export const formatNum = (n: number) => num.format(n);

/** Compact price for cards: RM781k, RM1.25m */
export function formatRMShort(n: number) {
  if (n >= 1_000_000) return `RM${(n / 1_000_000).toFixed(2).replace(/\.?0+$/, "")}m`;
  if (n >= 1_000) return `RM${Math.round(n / 1_000)}k`;
  return `RM${n}`;
}

export function sqftRange(min: number, max: number) {
  return min === max ? `${formatNum(min)} sq ft` : `${formatNum(min)} to ${formatNum(max)} sq ft`;
}

export function formatDate(iso: string | null) {
  if (!iso) return "Not stated";
  return new Date(`${iso}T00:00:00+08:00`).toLocaleDateString("en-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kuala_Lumpur",
  });
}
