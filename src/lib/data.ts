import { faqs, nearbyPlaces } from "@/data/content";
import { projects } from "@/data/projects";
import type { Project } from "@/data/types";
import { units } from "@/data/units";

export const allProjects = [...projects].sort((a, b) => a.featuredOrder - b.featuredOrder);

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug) ?? null;
}

export function getUnits(slug: string) {
  return units.filter((u) => u.projectSlug === slug).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getFaqs(slug: string) {
  return faqs.filter((f) => f.projectSlug === slug).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getNearby(slug: string) {
  return nearbyPlaces.filter((n) => n.projectSlug === slug).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function projectTitle(p: Pick<Project, "name" | "productName">) {
  return `${p.name} ${p.productName}`;
}

export const townships = Array.from(new Set(projects.map((p) => p.township)));
