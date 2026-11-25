import { Suspense } from "react";
import { ProjectBrowser } from "@/components/project-browser";
import { ProjectGrid } from "@/components/project-card";
import { WhatsAppFloat } from "@/components/whatsapp";
import type { Lang } from "@/i18n/config";
import { dict } from "@/i18n/dict";
import { getProjects } from "@/lib/data";

export function ProjectsView({ lang }: { lang: Lang }) {
  const t = dict(lang).projects;
  const projects = getProjects(lang);
  return (
    <div className="mx-auto max-w-6xl px-5 pt-[84px] sm:px-8 sm:pt-32">
      <p className="eyebrow">{t.eyebrow}</p>
      <h1 className="t-title mt-2">{t.title}</h1>
      <p className="t-lead mt-2 max-w-2xl sm:mt-3">{t.lead}</p>
      <div className="mt-7 sm:mt-10">
        <Suspense fallback={<ProjectGrid projects={projects} lang={lang} />}>
          <ProjectBrowser projects={projects} />
        </Suspense>
      </div>
      <WhatsAppFloat />
    </div>
  );
}
