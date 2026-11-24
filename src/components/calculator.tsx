"use client";

import { RotateCcw } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useId, useMemo, useState } from "react";
import { site } from "@/data/content";
import type { Project } from "@/data/types";
import { estimateLoan } from "@/lib/finance";
import { formatNum, formatRM } from "@/lib/format";
import { whatsappHref } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./whatsapp";

const D = site.calculator;
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
  hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
  display: string;
  hint?: string;
}) {
  const id = useId();
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="py-4">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[15px]">
          {label}
        </label>
        <span className="text-[17px] font-medium tabular">{display}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="calc-range mt-3 w-full"
        style={{ ["--pct" as string]: `${pct}%` }}
        aria-valuetext={display}
      />
      {hint && <p className="mt-1.5 text-[13px] text-subtle">{hint}</p>}
    </div>
  );
}

export function FinancialPlanner({ projects }: { projects: Project[] }) {
  const params = useSearchParams();
  const initialSlug = params.get("project") ?? "";
  const initialProject = projects.find((p) => p.slug === initialSlug);
  const qp = Number(params.get("price"));
  const initialPrice =
    Number.isFinite(qp) && qp > 0 ? clamp(qp, 100_000, 10_000_000) : initialProject?.showPrice ? initialProject.priceMin : 800_000;

  const [slug, setSlug] = useState(initialProject?.slug ?? "");
  const [price, setPrice] = useState(initialPrice);
  const [priceText, setPriceText] = useState(formatNum(initialPrice));
  const [margin, setMargin] = useState(D.defaultMarginOfFinance);
  const [rate, setRate] = useState(D.defaultInterestRate);
  const [years, setYears] = useState(D.defaultTenureYears);

  const est = useMemo(() => estimateLoan(price, margin, rate, years), [price, margin, rate, years]);
  const project = projects.find((p) => p.slug === slug);
  const priceId = useId();
  const projectId = useId();

  function setPriceValue(n: number) {
    const v = clamp(Math.round(n), 0, 10_000_000);
    setPrice(v);
    setPriceText(formatNum(v));
  }

  function pickProject(s: string) {
    setSlug(s);
    const p = projects.find((x) => x.slug === s);
    if (p?.showPrice) setPriceValue(p.priceMin);
  }

  function reset() {
    setMargin(D.defaultMarginOfFinance);
    setRate(D.defaultInterestRate);
    setYears(D.defaultTenureYears);
  }

  const interestShare = est.totalRepayment > 0 ? (est.totalInterest / est.totalRepayment) * 100 : 0;
  const projectLabel = project ? `${project.name} ${project.productName}` : "a property";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
      {/* Inputs */}
      <div className="card p-5 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={projectId} className="text-[14px] text-muted">
              Development (optional)
            </label>
            <select id={projectId} className="field mt-1.5 cursor-pointer" value={slug} onChange={(e) => pickProject(e.target.value)}>
              <option value="">Any property</option>
              {projects.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name} {p.productName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={priceId} className="text-[14px] text-muted">
              Property price (RM)
            </label>
            <input
              id={priceId}
              inputMode="numeric"
              className="field mt-1.5 tabular"
              value={priceText}
              onChange={(e) => {
                const digits = e.target.value.replace(/[^\d]/g, "");
                setPriceText(digits ? formatNum(Number(digits)) : "");
                setPrice(clamp(Number(digits || 0), 0, 10_000_000));
              }}
              onBlur={() => setPriceText(formatNum(price))}
            />
          </div>
        </div>
        {project && (
          <p className="mt-3 text-[13px] text-subtle">
            {project.showPrice
              ? `${project.priceRangeLabel} ${formatRM(project.priceMin)} to ${formatRM(project.priceMax)}. Unit pricing to be confirmed with Aqil.`
              : "Pricing for this development is being reconfirmed. Enter a price to explore."}
          </p>
        )}

        <div className="mt-4 divide-y divide-line">
          <Slider label="Margin of finance" value={margin} min={50} max={100} step={5} onChange={setMargin} display={`${margin}%`} hint={`Down payment ${formatRM(est.downPayment)}`} />
          <Slider label="Interest rate" value={rate} min={2} max={7} step={0.05} onChange={(n) => setRate(Math.round(n * 100) / 100)} display={`${rate.toFixed(2)}% p.a.`} />
          <Slider label="Loan tenure" value={years} min={5} max={35} step={1} onChange={setYears} display={`${years} years`} />
        </div>
        <button type="button" onClick={reset} className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-[14px] text-muted hover:text-text">
          <RotateCcw aria-hidden size={15} /> Reset assumptions
        </button>
        <p className="mt-2 text-[13px] text-subtle">
          Defaults ({D.defaultInterestRate}% p.a., {D.defaultTenureYears} years, {D.defaultMarginOfFinance}% margin) are planning
          assumptions reviewed {D.assumptionsLastReviewed}, not bank rates.
        </p>
      </div>

      {/* Results */}
      <div className="flex flex-col gap-4">
        <div className="card p-6 sm:p-8" aria-live="polite">
          <p className="text-[14px] text-muted">Estimated monthly instalment</p>
          <p className="mt-1 font-display text-[52px] leading-none tabular sm:text-[60px]">{formatRM(est.monthly)}</p>
          <p className="mt-2 text-[14px] text-muted">
            over {est.months} months on a {formatRM(est.loanAmount)} loan
          </p>

          <div className="mt-6" aria-hidden>
            <div className="flex h-2.5 overflow-hidden rounded-full bg-surface-2">
              <div className="bg-emerald" style={{ width: `${100 - interestShare}%` }} />
              <div className="bg-[#d9b45a]" style={{ width: `${interestShare}%` }} />
            </div>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-4 text-[14px]">
            <div>
              <dt className="flex items-center gap-2 text-muted">
                <span className="size-2.5 rounded-full bg-emerald" /> Principal
              </dt>
              <dd className="mt-1 text-[17px] tabular">{formatRM(est.loanAmount)}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-2 text-muted">
                <span className="size-2.5 rounded-full bg-[#d9b45a]" /> Total interest
              </dt>
              <dd className="mt-1 text-[17px] tabular">{formatRM(est.totalInterest)}</dd>
            </div>
            <div>
              <dt className="text-muted">Down payment</dt>
              <dd className="mt-1 text-[17px] tabular">{formatRM(est.downPayment)}</dd>
            </div>
            <div>
              <dt className="text-muted">Total repayment</dt>
              <dd className="mt-1 text-[17px] tabular">{formatRM(est.totalRepayment)}</dd>
            </div>
          </dl>
        </div>

        <div className="card p-6">
          <p className="text-[15px] font-medium">Other upfront costs</p>
          <ul className="mt-3 divide-y divide-line text-[14px]">
            <li className="flex justify-between gap-4 py-2.5">
              <span className="text-muted">Down payment ({100 - margin}%)</span>
              <span className="tabular">{formatRM(est.downPayment)}</span>
            </li>
            {site.upfrontCostItems
              .filter((i) => i.name !== "Down payment")
              .map((i) => (
                <li key={i.name} className="flex justify-between gap-4 py-2.5">
                  <span className="text-muted">{i.name}</span>
                  <span className="text-subtle">To confirm</span>
                </li>
              ))}
          </ul>
          <p className="mt-2 text-[12px] text-subtle">
            Legal fees and stamp duty are not estimated here until the rules are verified by a qualified professional. Developer packages may cover some costs.
          </p>
        </div>

        <a
          href={whatsappHref("financial_planner", { project: `${projectLabel} (${formatRM(price)}, ${margin}% margin, ${rate.toFixed(2)}%, ${years} years, est. ${formatRM(est.monthly)}/month)` })}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary w-full !min-h-12"
        >
          <WhatsAppIcon size={18} /> Discuss this estimate with Aqil
        </a>
        <p className="text-[12px] leading-relaxed text-subtle">{D.disclaimer}</p>
      </div>
    </div>
  );
}
