import type { Metadata } from "next";
import { Suspense } from "react";
import { FinancialPlanner } from "@/components/calculator";
import { allProjects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Financial planner",
  description: "Estimate monthly instalments, down payment and total interest for your next home. Planning estimates only.",
};

export default function CalculatorPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pt-[84px] sm:px-8 sm:pt-32">
      <p className="eyebrow">Financial planner</p>
      <h1 className="t-title mt-2">What will it cost each month?</h1>
      <p className="t-lead mt-2 max-w-2xl sm:mt-3">
        Move the sliders to see how price, margin, rate and tenure change your instalment. Bring the result to your
        conversation with Aqil or your bank.
      </p>
      <div className="mt-7 sm:mt-10">
        <Suspense fallback={<div className="card h-[520px] animate-pulse" />}>
          <FinancialPlanner projects={allProjects} />
        </Suspense>
      </div>
    </div>
  );
}
