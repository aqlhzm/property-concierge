"use client";

import { KeyRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

export type JourneyStep = { n: string; title: string; body: string; online: boolean };

/** Time for the progress bar to cross one step, in ms (linear: constant-rate progress). */
const STEP_MS = 340;

/**
 * The concierge journey as a progress story: each step's content rises in as it is seen,
 * while an emerald bar fills step by step, in order, 01 to 07, and ends on the keys.
 *
 * Without JavaScript, or with reduced motion, the final state shows at once
 * (the hidden starting state only applies once `data-ready` is set).
 */
export function Journey({ steps }: { steps: JourneyStep[] }) {
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = ref.current;
    if (!list) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const items = Array.from(list.querySelectorAll<HTMLElement>("[data-step]"));
    list.dataset.ready = "";

    // The bar never fills out of order: each newly seen step is queued after the last.
    let cursor = 0;
    const io = new IntersectionObserver(
      (entries) => {
        const now = performance.now();
        const seen = entries
          .filter((e) => e.isIntersecting && !("inview" in (e.target as HTMLElement).dataset))
          .map((e) => e.target as HTMLElement)
          .sort((a, b) => Number(a.dataset.step) - Number(b.dataset.step));

        seen.forEach((el, k) => {
          const start = Math.max(now + 120, cursor);
          cursor = start + STEP_MS;
          el.style.setProperty("--td", `${Math.round(start - now)}ms`);
          el.style.setProperty("--rd", `${k * 60}ms`);
          el.dataset.inview = "";
          io.unobserve(el);
        });
      },
      { threshold: 0.35, rootMargin: "0px 0px -8% 0px" },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <ol
      ref={ref}
      className="journey mt-10 grid gap-px overflow-hidden rounded-[20px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4"
      style={{ ["--step" as string]: `${STEP_MS}ms` }}
    >
      {steps.map((s, i) => (
        <li key={s.n} data-step={i} className="journey-step bg-surface p-6">
          <span aria-hidden className="journey-track" />
          <div className="journey-body flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2.5">
                <span className="journey-num font-display text-[22px] text-emerald-text tabular">{s.n}</span>
                <span aria-hidden className="journey-dot" />
              </span>
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                  s.online ? "bg-forest text-emerald-text" : "bg-sage-deep text-sage-text"
                }`}
              >
                {s.online ? "On this site" : "With Aqil"}
              </span>
            </div>
            <h3 className="text-[18px] font-medium">{s.title}</h3>
            <p className="text-[14px] text-muted">{s.body}</p>
          </div>
        </li>
      ))}
      <li
        data-step={steps.length}
        className="journey-step journey-cta bg-[linear-gradient(135deg,rgba(28,74,55,0.6),rgba(47,61,51,0.6))] p-6"
      >
        <span aria-hidden className="journey-track" />
        <span aria-hidden className="journey-glow" />
        <div className="journey-body flex h-full flex-col justify-between gap-4">
          <span aria-hidden className="journey-key grid size-11 place-items-center rounded-full bg-emerald/15 text-emerald-text ring-1 ring-emerald-text/30">
            <KeyRound size={20} />
          </span>
          <p className="text-[15px]">Ready to start? Tell Aqil what you need and he will shortlist for you.</p>
          <Link href="/enquire" className="btn btn-primary self-start">
            Get a recommendation
          </Link>
        </div>
      </li>
    </ol>
  );
}
