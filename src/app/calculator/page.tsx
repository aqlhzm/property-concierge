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
    <div className="mx-auto max-w-6xl px-5 pt-32 sm:px-8">
      <p className="eyebrow">Financial planner</p>
      <h1 className="mt-2 font-display text-[40px] leading-tight sm:text-[52px]">What will it cost each month?</h1>
      <p className="mt-3 max-w-2xl text-[17px] text-muted">
        Move the sliders to see how price, margin, rate and tenure change your instalment. Bring the result to your
        conversation with Aqil or your bank.
      </p>
      <div className="mt-10">
        <Suspense fallback={<div className="card h-[520px] animate-pulse" />}>
          <FinancialPlanner projects={allProjects} />
        </Suspense>
      </div>
    </div>
  );
}
