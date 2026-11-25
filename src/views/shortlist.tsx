import { Suspense } from "react";
import { ShortlistView as Shortlist } from "@/components/shortlist-view";
import type { Lang } from "@/i18n/config";
import { getAllUnits, getProjects } from "@/lib/data";

export function ShortlistView({ lang }: { lang: Lang }) {
  return (
    <div className="mx-auto max-w-6xl px-5 pt-[var(--page-top)] sm:px-8 sm:pt-32">
      <Suspense fallback={<div className="card mt-8 h-64 animate-pulse" />}>
        <Shortlist projects={getProjects(lang)} units={getAllUnits(lang)} />
      </Suspense>
    </div>
  );
}
