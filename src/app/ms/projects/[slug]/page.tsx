import type { Metadata } from "next";
import { ProjectView, projectMetadata, projectStaticParams } from "@/views/project";

export function generateStaticParams() {
  return projectStaticParams();
}

export async function generateMetadata({ params }: PageProps<"/ms/projects/[slug]">): Promise<Metadata> {
  return projectMetadata((await params).slug, "ms");
}

export default async function Page({ params }: PageProps<"/ms/projects/[slug]">) {
  return <ProjectView slug={(await params).slug} lang="ms" />;
}
