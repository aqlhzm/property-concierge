import type { Metadata } from "next";
import { ProjectView, projectMetadata, projectStaticParams } from "@/views/project";

export function generateStaticParams() {
  return projectStaticParams();
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  return projectMetadata((await params).slug, "en");
}

export default async function Page({ params }: PageProps<"/projects/[slug]">) {
  return <ProjectView slug={(await params).slug} lang="en" />;
}
