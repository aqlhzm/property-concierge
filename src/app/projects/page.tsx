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
    <div className="mx-auto max-w-6xl px-5 pt-32 sm:px-8">
      <p className="eyebrow">Developments</p>
      <h1 className="mt-2 font-display text-[40px] leading-tight sm:text-[52px]">Find your next home</h1>
      <p className="mt-3 max-w-2xl text-[17px] text-muted">
        Every figure here comes from the developer’s brochure. Where a price or status needs reconfirming, it says so.
      </p>
      <div className="mt-10">
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
