"use client";

import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Project, UnitType } from "@/data/types";
import { formatNum, formatRM, sqftRange } from "@/lib/format";
import { whatsappHref } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./whatsapp";

type Row = { label: string; render: (p: Project) => React.ReactNode };

export function CompareView({ projects, units }: { projects: Project[]; units: UnitType[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const fromUrl = (params.get("p") ?? "").split(",").filter((s) => projects.some((p) => p.slug === s));
  const selected = fromUrl.length ? fromUrl : projects.map((p) => p.slug);
  const shown = projects.filter((p) => selected.includes(p.slug));

  function toggle(slug: string) {
    const next = selected.includes(slug) ? selected.filter((s) => s !== slug) : [...selected, slug];
    if (next.length === 0) return; // keep at least one
    const ordered = projects.map((p) => p.slug).filter((s) => next.includes(s));
    router.replace(`${pathname}?p=${ordered.join(",")}`, { scroll: false });
  }

  const unitCount = (slug: string) => units.filter((u) => u.projectSlug === slug);

  const rows: Row[] = [
    {
      label: "Price range",
      render: (p) =>
        p.showPrice ? (
          <span className="tabular">
            {formatRM(p.priceMin)} to {formatRM(p.priceMax)}
          </span>
        ) : (
          <span className="text-muted">To be reconfirmed</span>
        ),
    },
    { label: "Home type", render: (p) => p.propertyType },
    { label: "Lot size", render: (p) => p.lotSize },
    { label: "Built up", render: (p) => <span className="tabular">{sqftRange(p.builtUpMin, p.builtUpMax)}</span> },
    {
      label: "Price per sq ft (from)",
      render: (p) =>
        p.showPrice ? (
          <span className="tabular">RM{formatNum(Math.round(p.priceMin / p.builtUpMin))}</span>
        ) : (
          <span className="text-muted">Not available</span>
        ),
    },
    { label: "Bedrooms · bathrooms", render: (p) => `${p.bedrooms} · ${p.bathrooms}` },
    { label: "Unit types", render: (p) => unitCount(p.slug).map((u) => u.code).join(", ") },
    { label: "Total units", render: (p) => p.totalUnitsLabel ?? formatNum(p.totalUnits) },
    { label: "Land tenure", render: (p) => p.landTenure },
    { label: "Expected completion", render: (p) => p.expectedCompletion },
    { label: "Status", render: (p) => p.salesStatus },
    { label: "Bumiputra discount", render: (p) => p.bumiputraDiscount },
    {
      label: "Facilities",
      render: (p) => (
        <span className="line-clamp-4 sm:line-clamp-none" title={p.facilities.join(", ")}>
          {p.facilities.join(", ")}
        </span>
      ),
    },
    { label: "Developer", render: (p) => `${p.developerBrand} · ${p.developerEntity}` },
  ];

  const shortlist = shown.map((p) => `${p.name} ${p.productName}`).join(", ");

  return (
    <div>
      <fieldset className="min-w-0">
        <legend className="text-[13px] text-muted sm:text-[14px]">Choose developments to compare</legend>
        {/* Phone: one swipeable row of compact toggles instead of a tall stack */}
        <div className="scroll-row -mx-5 mt-2.5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:mt-3 sm:flex-wrap sm:overflow-visible sm:px-0">
          {projects.map((p) => {
            const on = selected.includes(p.slug);
            return (
              <button
                key={p.slug}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(p.slug)}
                className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border pr-3.5 pl-2.5 text-[13px] whitespace-nowrap transition-colors duration-200 sm:min-h-11 sm:px-4 sm:text-[14px] ${
                  on ? "border-transparent bg-forest text-text" : "border-line-strong text-muted hover:text-text"
                }`}
              >
                <span className={`grid size-5 place-items-center rounded-full ${on ? "pill-active" : "border border-line-strong"}`}>
                  {on && <Check aria-hidden size={13} strokeWidth={3} />}
                </span>
                {p.name} <span className="text-muted">{p.productName.replace(/ Homes?$/, "")}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="card mt-5 overflow-x-auto sm:mt-8">
        <table className="w-full min-w-[560px] border-collapse text-left text-[13px] sm:text-[14px]">
          <caption className="sr-only">Comparison of {shortlist}</caption>
          <thead>
            <tr>
              <th scope="col" className="sticky left-0 z-10 w-28 bg-surface p-3 align-bottom sm:w-44 sm:p-4 text-[12px] font-medium tracking-[0.14em] text-muted uppercase">
                Development
              </th>
              {shown.map((p) => (
                <th key={p.slug} scope="col" className="min-w-[184px] p-3 align-top font-normal sm:min-w-[200px] sm:p-4">
                  <Link href={`/projects/${p.slug}`} className="group block">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
                      <Image src={p.heroImage.url} alt={p.heroImage.caption} fill sizes="260px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <p className="mt-2.5 font-display text-[18px] leading-tight sm:mt-3 sm:text-[20px]">{p.name}</p>
                    <p className="text-[13px] sm:text-[14px]" style={{ color: p.theme.accent }}>
                      {p.productName}
                    </p>
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-t border-line">
                <th scope="row" className="sticky left-0 z-10 bg-surface p-3 align-top text-[12px] font-normal text-muted sm:p-4 sm:text-[14px]">
                  {r.label}
                </th>
                {shown.map((p) => (
                  <td key={p.slug} className="p-3 align-top sm:p-4">
                    {r.render(p)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[12px] leading-relaxed text-subtle sm:text-[13px]">
        Prices are permit ranges from developer brochures, not unit quotes. Price per sq ft divides the lowest permit price
        by the smallest built up, so treat it as a rough guide only.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-2.5 sm:mt-8 sm:flex sm:flex-wrap sm:gap-3">
        <a href={whatsappHref("comparison", { shortlist })} target="_blank" rel="noopener noreferrer" className="btn btn-primary !px-3 sm:!px-5">
          <WhatsAppIcon size={17} /> Help me decide
        </a>
        <Link href="/enquire?intent=recommendation" className="btn btn-ghost !px-3 sm:!px-5">
          <span className="sm:hidden">Recommendation</span>
          <span className="max-sm:hidden">Request a recommendation</span>
        </Link>
      </div>
    </div>
  );
}
