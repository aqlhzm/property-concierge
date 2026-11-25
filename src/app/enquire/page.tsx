import type { Metadata } from "next";
import { dict } from "@/i18n/dict";
import { alternates } from "@/lib/site";
import { EnquireView } from "@/views/enquire";

export const metadata: Metadata = {
  ...dict("en").meta.enquire,
  alternates: alternates("en", "/enquire"),
};

export default function Page() {
  return <EnquireView lang="en" />;
}
