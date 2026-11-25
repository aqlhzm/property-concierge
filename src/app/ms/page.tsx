import type { Metadata } from "next";
import { dict } from "@/i18n/dict";
import { alternates } from "@/lib/site";
import { HomeView } from "@/views/home";

export const metadata: Metadata = {
  description: dict("ms").meta.siteDescription,
  alternates: alternates("ms", "/"),
};

export default function Page() {
  return <HomeView lang="ms" />;
}
