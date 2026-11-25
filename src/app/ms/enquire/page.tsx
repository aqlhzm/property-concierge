import type { Metadata } from "next";
import { dict } from "@/i18n/dict";
import { alternates } from "@/lib/site";
import { EnquireView } from "@/views/enquire";

export const metadata: Metadata = {
  ...dict("ms").meta.enquire,
  alternates: alternates("ms", "/enquire"),
};

export default function Page() {
  return <EnquireView lang="ms" />;
}
