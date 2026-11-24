import type { Metadata } from "next";
import { Suspense } from "react";
import { ShortlistView } from "@/components/shortlist-view";
import { units } from "@/data/units";
import { allProjects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Your shortlist",
  description: "Homes you saved, side by side. Share them with family or send them to Aqil.",
  // A personal list: keep it out of search results
  robots: { index: false, follow: true },
};

export default function ShortlistPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pt-[84px] sm:px-8 sm:pt-32">
      <Suspense fallback={<div className="card mt-8 h-64 animate-pulse" />}>
        <ShortlistView projects={allProjects} units={units} />
      </Suspense>
    </div>
  );
}
