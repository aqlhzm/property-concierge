import type { Metadata } from "next";
import { dict } from "@/i18n/dict";
import { alternates } from "@/lib/site";
import { ProjectsView } from "@/views/projects";

export const metadata: Metadata = {
  ...dict("en").meta.projects,
  alternates: alternates("en", "/projects"),
};

export default function Page() {
  return <ProjectsView lang="en" />;
}
