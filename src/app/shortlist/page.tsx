import type { Metadata } from "next";
import { dict } from "@/i18n/dict";
import { alternates } from "@/lib/site";
import { ShortlistView } from "@/views/shortlist";

export const metadata: Metadata = {
  ...dict("en").meta.shortlist,
  alternates: alternates("en", "/shortlist"),
  // A personal list: keep it out of search results
  robots: { index: false, follow: true },
};

export default function Page() {
  return <ShortlistView lang="en" />;
}
