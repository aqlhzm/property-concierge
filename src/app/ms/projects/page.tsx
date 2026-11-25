import type { Metadata } from "next";
import { dict } from "@/i18n/dict";
import { alternates } from "@/lib/site";
import { ProjectsView } from "@/views/projects";

export const metadata: Metadata = {
  ...dict("ms").meta.projects,
  alternates: alternates("ms", "/projects"),
};

export default function Page() {
  return <ProjectsView lang="ms" />;
}
