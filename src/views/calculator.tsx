import { Suspense } from "react";
import { FinancialPlanner } from "@/components/calculator";
import type { Lang } from "@/i18n/config";
import { dict } from "@/i18n/dict";
import { getProjects } from "@/lib/data";

export function CalculatorView({ lang }: { lang: Lang }) {
  const t = dict(lang).calc;
  return (
    <div className="mx-auto max-w-6xl px-5 pt-[84px] sm:px-8 sm:pt-32">
      <p className="eyebrow">{t.eyebrow}</p>
      <h1 className="t-title mt-2">{t.title}</h1>
      <p className="t-lead mt-2 max-w-2xl sm:mt-3">{t.lead}</p>
      <div className="mt-7 sm:mt-10">
        <Suspense fallback={<div className="card h-[520px] animate-pulse" />}>
          <FinancialPlanner projects={getProjects(lang)} />
        </Suspense>
      </div>
    </div>
  );
}
