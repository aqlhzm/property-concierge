"use client";

import Link from "next/link";
import { site } from "@/data/content";
import { lp } from "@/i18n/config";
import { useLang, useT } from "@/i18n/client";

export function Wordmark({ size = "sm", href }: { size?: "sm" | "lg"; href?: string | null }) {
  const lang = useLang();
  const t = useT();
  const to = href === undefined ? lp(lang, "/") : href;
  const body = (
    <span className="inline-flex flex-col items-start leading-none">
      <span
        className={
          size === "lg"
            ? "text-[18px] font-semibold tracking-[0.3em] text-text sm:text-[20px]"
            : "text-[10.5px] font-semibold tracking-[0.18em] whitespace-nowrap text-text min-[380px]:tracking-[0.2em] min-[400px]:tracking-[0.24em] sm:text-[15px] sm:tracking-[0.26em]"
        }
      >
        {site.brandName}
      </span>
      <span
        className={`font-signature leading-none text-sage-text ${size === "lg" ? "mt-1 ml-auto pr-1 text-[30px]" : "mt-0.5 ml-auto pr-0.5 text-[16px] sm:text-[23px]"}`}
        aria-label={site.brandSignature}
      >
        {site.brandSignature}
      </span>
    </span>
  );
  if (!to) return body;
  return (
    <Link href={to} aria-label={`${site.brandName} ${site.brandSignature}, ${t.nav.homeLabel}`} className="inline-flex min-h-11 shrink-0 items-center">
      {body}
    </Link>
  );
}
