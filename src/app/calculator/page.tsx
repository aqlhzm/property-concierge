import type { Metadata } from "next";
import { dict } from "@/i18n/dict";
import { alternates } from "@/lib/site";
import { CalculatorView } from "@/views/calculator";

export const metadata: Metadata = {
  ...dict("en").meta.calculator,
  alternates: alternates("en", "/calculator"),
};

export default function Page() {
  return <CalculatorView lang="en" />;
}
