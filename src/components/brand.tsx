import Link from "next/link";
import { site } from "@/data/content";

export function Wordmark({ size = "sm", href = "/" }: { size?: "sm" | "lg"; href?: string | null }) {
  const body = (
    <span className="inline-flex flex-col items-start leading-none">
      <span
        className={
          size === "lg"
            ? "text-[18px] font-semibold tracking-[0.3em] text-text sm:text-[20px]"
            : "text-[13px] font-semibold tracking-[0.26em] text-text sm:text-[15px]"
        }
      >
        {site.brandName}
      </span>
      <span
        className={`font-signature leading-none text-sage-text ${size === "lg" ? "mt-1 ml-auto pr-1 text-[30px]" : "mt-0.5 ml-auto pr-0.5 text-[21px] sm:text-[23px]"}`}
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
