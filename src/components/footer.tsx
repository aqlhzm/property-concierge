import Link from "next/link";
import { site } from "@/data/content";
import { Wordmark } from "./brand";

const EXPLORE = [
  ["/projects", "Developments"],
  ["/compare", "Compare"],
  ["/calculator", "Financial planner"],
  ["/enquire", "Arrange a viewing"],
] as const;

/**
 * Phone: a short colophon. The tab bar already carries navigation, so the link lists are not
 * repeated; only what the tab bar lacks (viewing, privacy) stays, on one quiet row.
 * Larger screens: the full three column footer.
 */
export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line pb-[calc(var(--tabbar-h)+var(--tabbar-gap)+20px)] sm:mt-24 md:pb-12">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 pt-8 sm:px-8 sm:pt-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <span className="md:hidden">
            <Wordmark />
          </span>
          <span className="max-md:hidden">
            <Wordmark size="lg" />
          </span>
          <p className="mt-5 hidden max-w-sm text-[14px] text-muted md:block">{site.serviceApproach}</p>
        </div>
        <div className="hidden md:block">
          <p className="eyebrow">Explore</p>
          <ul className="mt-4 space-y-2 text-[14px]">
            {EXPLORE.map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="inline-flex min-h-9 items-center text-muted hover:text-text">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="hidden md:block">
          <p className="eyebrow">Consultant</p>
          <ul className="mt-4 space-y-2 text-[14px] text-muted">
            <li>
              {site.consultantName} · {site.consultantTitle}
            </li>
            {site.renRegistration && <li>REN {site.renRegistration}</li>}
            {site.agencyName && <li>{site.agencyName}</li>}
            <li>
              <Link href="/privacy" className="inline-flex min-h-9 items-center hover:text-text">
                Privacy notice
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Phone colophon: who, then the two links the tab bar does not carry */}
      <div className="mx-auto mt-3 max-w-6xl px-5 text-[13px] text-muted md:hidden">
        <p>
          {site.consultantName} · {site.consultantTitle}
          {site.renRegistration ? ` · REN ${site.renRegistration}` : ""}
        </p>
        <p className="-my-1 flex items-center gap-1">
          <Link href="/enquire?intent=viewing" className="inline-flex min-h-11 items-center text-emerald-text">
            Arrange a viewing
          </Link>
          <span aria-hidden className="px-1.5 text-subtle">
            ·
          </span>
          <Link href="/privacy" className="inline-flex min-h-11 items-center hover:text-text">
            Privacy notice
          </Link>
        </p>
      </div>

      <p className="mx-auto mt-2 max-w-6xl px-5 text-[12px] leading-relaxed text-subtle sm:px-8 md:mt-10 md:text-[13px]">
        Project information is taken from developer brochures and is subject to change. Images are labelled with their
        source type. Prices, availability and packages must be confirmed with the consultant. © 2026 aqilgotkeys.
      </p>
    </footer>
  );
}
