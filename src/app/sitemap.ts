import type { MetadataRoute } from "next";
import { allProjects } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

/** Public pages only. /privacy is draft and noindex, so it is left out. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; priority: number; changeFrequency: "weekly" | "monthly" }[] = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/projects", priority: 0.9, changeFrequency: "weekly" },
    ...allProjects.map((p) => ({ path: `/projects/${p.slug}`, priority: 0.9, changeFrequency: "weekly" as const })),
    { path: "/compare", priority: 0.6, changeFrequency: "monthly" },
    { path: "/calculator", priority: 0.6, changeFrequency: "monthly" },
    { path: "/enquire", priority: 0.7, changeFrequency: "monthly" },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  ];
  return pages.map((p) => ({ url: `${SITE_URL}${p.path}`, changeFrequency: p.changeFrequency, priority: p.priority }));
}
