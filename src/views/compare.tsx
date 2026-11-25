import { Suspense } from "react";
import { CompareView as CompareTable } from "@/components/compare";
import type { Lang } from "@/i18n/config";
import { dict } from "@/i18n/dict";
import { getAllUnits, getProjects } from "@/lib/data";

export function CompareView({ lang }: { lang: Lang }) {
  const t = dict(lang).compare;
  return (
    <div className="mx-auto max-w-6xl px-5 pt-[var(--page-top)] sm:px-8 sm:pt-32">
      <p className="eyebrow">{t.eyebrow}</p>
      <h1 className="t-title mt-2">{t.title}</h1>
      <p className="t-lead mt-2 max-w-2xl sm:mt-3">{t.lead}</p>
      <div className="mt-7 sm:mt-10">
        <Suspense fallback={<div className="card h-[600px] animate-pulse" />}>
          <CompareTable projects={getProjects(lang)} units={getAllUnits(lang)} />
        </Suspense>
      </div>
    </div>
  );
}
