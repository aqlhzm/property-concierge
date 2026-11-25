import type { Metadata } from "next";
import { dict } from "@/i18n/dict";
import { alternates } from "@/lib/site";
import { PrivacyView } from "@/views/privacy";

export const metadata: Metadata = {
  title: dict("ms").meta.privacy.title,
  alternates: alternates("ms", "/privacy"),
  robots: { index: false },
};

export default function Page() {
  return <PrivacyView lang="ms" />;
}
