import type { Metadata } from "next";
import { IMAGES } from "@/data/projects";
import { dict } from "@/i18n/dict";
import { openGraph } from "@/lib/site";

/** Bahasa Melayu pages: same design and data, Malay copy. The <html lang> follows the address (see HtmlLang). */
export const metadata: Metadata = {
  description: dict("ms").meta.siteDescription,
  openGraph: openGraph(IMAGES.ogDefault, "PROPERTY CONCIERGE by aqilgotkeys: Stargazer's Gazebo di Wellington Garden", "ms"),
};

export default function MalayLayout({ children }: LayoutProps<"/ms">) {
  return <div lang="ms-MY">{children}</div>;
}
