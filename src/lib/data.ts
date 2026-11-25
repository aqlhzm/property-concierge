import { faqs, nearbyPlaces, site } from "@/data/content";
import { projects } from "@/data/projects";
import type { NearbyPlace, Project, UnitType } from "@/data/types";
import { units } from "@/data/units";
import type { Lang } from "@/i18n/config";
import { captionMs, faqsMs, NEARBY_NAMES_MS, PROJECTS_MS, SITE_MS, SPEC_ITEMS_MS, SPEC_VALUES_MS, unitMs } from "@/i18n/data-ms";

export const allProjects = [...projects].sort((a, b) => a.featuredOrder - b.featuredOrder);

/** A development in the reader's language. Names, figures and permit numbers never change. */
export function localizeProject(p: Project, lang: Lang): Project {
  if (lang === "en") return p;
  const t = PROJECTS_MS[p.slug] ?? {};
  return {
    ...p,
    ...t,
    lotSize: p.lotSize.replace(/ to /g, " hingga "),
    salesGallery: { ...p.salesGallery, ...t.salesGallery },
    heroImage: captionMs(p.heroImage),
    cardImage: p.cardImage ? captionMs(p.cardImage) : undefined,
    gallery: p.gallery.map(captionMs),
    specifications: p.specifications.map((s) => ({
      group: s.group,
      item: SPEC_ITEMS_MS[s.item] ?? s.item,
      value: SPEC_VALUES_MS[s.value] ?? s.value,
    })),
  };
}

export function localizeUnit(u: UnitType, lang: Lang): UnitType {
  return lang === "en" ? u : unitMs(u);
}

export function getProjects(lang: Lang = "en") {
  return allProjects.map((p) => localizeProject(p, lang));
}

export function getAllUnits(lang: Lang = "en") {
  return units.map((u) => localizeUnit(u, lang));
}

export function getProject(slug: string, lang: Lang = "en") {
  const p = projects.find((x) => x.slug === slug);
  return p ? localizeProject(p, lang) : null;
}

export function getUnits(slug: string, lang: Lang = "en") {
  return units
    .filter((u) => u.projectSlug === slug)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((u) => localizeUnit(u, lang));
}

export function getFaqs(slug: string, lang: Lang = "en") {
  const list = faqs.filter((f) => f.projectSlug === slug).sort((a, b) => a.sortOrder - b.sortOrder);
  return lang === "en" ? list : faqsMs(list);
}

export function getNearby(slug: string, lang: Lang = "en"): NearbyPlace[] {
  const list = nearbyPlaces.filter((n) => n.projectSlug === slug).sort((a, b) => a.sortOrder - b.sortOrder);
  return lang === "en" ? list : list.map((n) => ({ ...n, name: NEARBY_NAMES_MS[n.name] ?? n.name }));
}

/** Consultant and site wording that differs by language */
export function siteText(lang: Lang) {
  if (lang === "en") {
    return {
      consultantTitle: site.consultantTitle,
      serviceApproach: site.serviceApproach,
      consentText: site.consentText,
      calculatorDisclaimer: site.calculator.disclaimer,
      upfrontName: (name: string) => name,
    };
  }
  return {
    consultantTitle: SITE_MS.consultantTitle,
    serviceApproach: SITE_MS.serviceApproach,
    consentText: SITE_MS.consentText,
    calculatorDisclaimer: SITE_MS.calculatorDisclaimer,
    upfrontName: (name: string) => SITE_MS.upfront[name] ?? name,
  };
}

export function projectTitle(p: Pick<Project, "name" | "productName">) {
  return `${p.name} ${p.productName}`;
}

export const townships = Array.from(new Set(projects.map((p) => p.township)));
