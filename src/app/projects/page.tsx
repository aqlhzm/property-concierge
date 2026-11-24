import type { Metadata } from "next";
import { Suspense } from "react";
import { ProjectBrowser } from "@/components/project-browser";
import { ProjectGrid } from "@/components/project-card";
import { WhatsAppFloat } from "@/components/whatsapp";
import { allProjects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Developments",
  description: "Browse the residential developments Aqil Hazim advises on, with unit plans, specifications and price ranges.",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pt-[84px] sm:px-8 sm:pt-32">
      <p className="eyebrow">Developments</p>
      <h1 className="t-title mt-2">Find your next home</h1>
      <p className="t-lead mt-2 max-w-2xl sm:mt-3">
        Every figure here comes from the developer’s brochure. Where a price or status needs reconfirming, it says so.
      </p>
      <div className="mt-7 sm:mt-10">
        <Suspense
          fallback={
            <ProjectGrid projects={allProjects} />
          }
        >
          <ProjectBrowser projects={allProjects} />
        </Suspense>
      </div>
      <WhatsAppFloat />
    </div>
  );
}
