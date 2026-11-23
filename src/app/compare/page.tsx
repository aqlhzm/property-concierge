import type { Metadata } from "next";
import { Suspense } from "react";
import { CompareView } from "@/components/compare";
import { units } from "@/data/units";
import { allProjects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Compare developments",
  description: "Compare lot size, built up, tenure, completion and price range across developments side by side.",
};

export default function ComparePage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pt-32 sm:px-8">
      <p className="eyebrow">Compare</p>
      <h1 className="mt-2 font-display text-[40px] leading-tight sm:text-[52px]">Side by side</h1>
      <p className="mt-3 max-w-2xl text-[17px] text-muted">
        The details that matter most, on one screen. Share the link to send the same comparison to family.
      </p>
      <div className="mt-10">
        <Suspense fallback={<div className="card h-[600px] animate-pulse" />}>
          <CompareView projects={allProjects} units={units} />
        </Suspense>
      </div>
    </div>
  );
}
