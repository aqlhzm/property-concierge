import Link from "next/link";
import { site } from "@/data/content";

export function Wordmark({ size = "sm", href = "/" }: { size?: "sm" | "lg"; href?: string | null }) {
  const body = (
    <span className="inline-flex flex-col items-start leading-none">
      <span
        className={
          size === "lg"
            ? "text-[15px] font-semibold tracking-[0.32em] text-text sm:text-base"
            : "text-[12px] font-semibold tracking-[0.28em] text-text"
        }
      >
        {site.brandName}
      </span>
      <span
        className={`font-signature leading-none text-emerald-text ${size === "lg" ? "mt-1.5 ml-auto pr-1 text-[28px]" : "mt-1 ml-auto pr-0.5 text-[20px]"}`}
        aria-label={site.brandSignature}
      >
        {site.brandSignature}
      </span>
    </span>
  );
  if (!href) return body;
  return (
    <Link href={href} aria-label={`${site.brandName} ${site.brandSignature}, home`} className="inline-flex min-h-11 items-center">
      {body}
    </Link>
  );
}
