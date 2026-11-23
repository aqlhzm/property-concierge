import Link from "next/link";
import { site } from "@/data/content";
import { Wordmark } from "./brand";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line pb-32 md:pb-12">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 pt-12 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Wordmark size="lg" />
          <p className="mt-5 max-w-sm text-[14px] text-muted">{site.serviceApproach}</p>
        </div>
        <div>
          <p className="eyebrow">Explore</p>
          <ul className="mt-4 space-y-2 text-[14px]">
            {[
              ["/projects", "Developments"],
              ["/compare", "Compare"],
              ["/calculator", "Financial planner"],
              ["/enquire", "Arrange a viewing"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="inline-flex min-h-9 items-center text-muted hover:text-text">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
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
      <p className="mx-auto mt-10 max-w-6xl px-5 text-[13px] leading-relaxed text-subtle sm:px-8">
        Project information is taken from developer brochures and is subject to change. Images are labelled with their
        source type. Prices, availability and packages must be confirmed with the consultant. © 2026 aqilgotkeys.
      </p>
    </footer>
  );
}
