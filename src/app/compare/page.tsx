import type { Metadata } from "next";
import { dict } from "@/i18n/dict";
import { alternates } from "@/lib/site";
import { CompareView } from "@/views/compare";

export const metadata: Metadata = {
  ...dict("en").meta.compare,
  alternates: alternates("en", "/compare"),
};

export default function Page() {
  return <CompareView lang="en" />;
}
