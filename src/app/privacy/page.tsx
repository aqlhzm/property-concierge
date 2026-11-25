import type { Metadata } from "next";
import { dict } from "@/i18n/dict";
import { alternates } from "@/lib/site";
import { PrivacyView } from "@/views/privacy";

export const metadata: Metadata = {
  title: dict("en").meta.privacy.title,
  alternates: alternates("en", "/privacy"),
  robots: { index: false },
};

export default function Page() {
  return <PrivacyView lang="en" />;
}
