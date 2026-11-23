"use client";

import { KeyRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";

export type JourneyStep = { n: string; title: string; body: string; online: boolean };

/**
 * "Watch your home come together": the concierge journey as a blueprint that builds
 * itself as the reader scrolls. A sticky drawing on one side, the steps on the other;
 * each step draws its part of the home, ending with the door opening and the keys.
 *
 * Native scrolling throughout (no scroll-jacking). Without JS, or with reduced motion,
 * the finished home and every step show at once.
 */
export function Journey({ steps }: { steps: JourneyStep[] }) {
  const listRef = useRef<HTMLOListElement>(null);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(steps.length - 1);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const chapters = Array.from(list.querySelectorAll<HTMLElement>("[data-chapter]"));
    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    // A thin band across the screen: the chapter crossing it is the current one.
    // On phones the band sits below the sticky drawing.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.chapter));
        }
      },
      { rootMargin: desktop ? "-48% 0px -48% 0px" : "-64% 0px -30% 0px" },
    );
    chapters.forEach((c) => io.observe(c));

    // Start empty only if the reader has not scrolled past the first chapter yet.
    const first = chapters[0]?.getBoundingClientRect();
    const startEmpty = !first || first.top > window.innerHeight * 0.5;
    setActive(startEmpty ? -1 : 0);
    setReady(true);
    return () => io.disconnect();
  }, []);

  const total = steps.length;
  const shown = ready ? active : total - 1;
  const on = (at: number) => shown >= at;
  const current = steps[Math.max(0, shown)];

  return (
    <div className="journey-bp mt-10 grid gap-x-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)]">
      {/* Sticky blueprint */}
      <div className="sticky top-[84px] z-10 h-[40svh] min-h-[280px] lg:top-24 lg:h-[calc(100svh-8rem)] lg:max-h-[680px]">
        <div className="bp-canvas relative h-full overflow-hidden rounded-[28px] border border-line">
          {/* Label */}
          <div className="absolute top-4 left-5 z-10 lg:top-6 lg:left-7">
            <p className="text-[11px] font-medium tracking-[0.22em] text-sage uppercase tabular">
              {shown < 0 ? "Your home" : `Step ${current.n} / ${String(total).padStart(2, "0")}`}
            </p>
            <p key={shown} className="bp-label mt-1 font-display text-[22px] text-white lg:text-[30px]">
              {shown < 0 ? "Scroll to begin" : current.title}
            </p>
          </div>

          <svg
            viewBox="0 0 400 330"
            className="absolute inset-x-0 top-[16%] bottom-[12%] mx-auto h-[72%] w-full lg:top-[14%] lg:h-[74%]"
            role="img"
            aria-label={`Blueprint of a home, ${shown < 0 ? "not started" : `built up to step ${current.n}, ${current.title}`}`}
          >
            <defs>
              <radialGradient id="bp-warm" cx="50%" cy="100%" r="80%">
                <stop offset="0%" stopColor="#f6e2ad" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#f6e2ad" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="bp-spill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f6e2ad" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#f6e2ad" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* 01 Discover: the ground, the lot, a pin drops on it */}
            <g>
              <Line d="M24 272 H376" on={on(0)} i={0} />
              <Line d="M70 262 V282" on={on(0)} i={1} />
              <Line d="M330 262 V282" on={on(0)} i={1} />
              <Line d="M70 292 H330 M70 288 V296 M330 288 V296" on={on(0)} i={2} dim />
              <g className={`bp-pin ${on(0) && !(ready ? shown >= 2 : true) ? "on" : ""}`}>
                <path
                  d="M200 152 C188 138 182 128 182 120 A18 18 0 1 1 218 120 C218 128 212 138 200 152 Z"
                  className="bp-solid"
                />
                <circle cx="200" cy="120" r="6" className="bp-hole" />
              </g>
            </g>

            {/* 02 Understand: storey levels and dimensions, like a plan */}
            <g>
              <path d="M64 207 H336" className={`bp-guide ${on(1) ? "on" : ""}`} style={d(0)} />
              <path d="M64 152 H336" className={`bp-guide ${on(1) ? "on" : ""}`} style={d(1)} />
              <Line d="M354 272 V152 M350 272 H358 M350 207 H358 M350 152 H358" on={on(1)} i={2} dim />
            </g>

            {/* 03 Qualify: the walls go up on solid ground */}
            <g>
              <Line d="M82 272 V152 H318 V272" on={on(2)} i={0} />
              <Line d="M82 207 H318" on={on(2)} i={2} />
            </g>

            {/* 04 Experience: windows drawn, then the lights come on */}
            <g>
              {[
                [102, 166, 48, 26],
                [176, 166, 48, 26],
                [250, 166, 48, 26],
                [102, 222, 56, 34],
                [246, 222, 52, 34],
              ].map(([x, y, w, h], k) => (
                <g key={k}>
                  <rect x={x} y={y} width={w} height={h} rx="2" className={`bp-light ${on(3) ? "on" : ""}`} style={d(k + 4)} />
                  <Rect x={x} y={y} w={w} h={h} on={on(3)} i={k} />
                </g>
              ))}
              <Rect x={182} y={222} w={36} h={50} on={on(3)} i={5} />
            </g>

            {/* 05 Purchase: the roof completes the home; signed */}
            <g>
              <Line d="M62 155 L200 88 L338 155" on={on(4)} i={0} />
              <g className={`bp-seal ${on(4) ? "on" : ""}`}>
                <circle cx="344" cy="64" r="17" className="bp-seal-ring" />
                <path d="M335 64 l6 6 l12 -13" className="bp-seal-tick" />
              </g>
            </g>

            {/* 06 Track: landscape and path appear, construction progress fills */}
            <g>
              <Line d="M46 272 V246" on={on(5)} i={0} />
              <circle cx="46" cy="230" r="17" pathLength={1} className={`bp-line ${on(5) ? "on" : ""}`} style={d(1)} />
              <Line d="M358 272 V246" on={on(5)} i={0} />
              <circle cx="358" cy="230" r="17" pathLength={1} className={`bp-line ${on(5) ? "on" : ""}`} style={d(1)} />
              <Line d="M188 272 L176 300 M212 272 L224 300" on={on(5)} i={2} dim />
              <path d="M120 316 H280" className={`bp-track ${on(5) ? "on" : ""}`} />
              <rect x="120" y="314.5" width="160" height="3" rx="1.5" className={`bp-progress ${on(5) ? "on" : ""}`} />
            </g>

            {/* 07 Handover: the door opens, warm light spills out, the keys arrive */}
            <g>
              <path d="M182 272 L218 272 L246 304 L154 304 Z" fill="url(#bp-spill)" className={`bp-fade ${on(6) ? "on" : ""}`} style={d(3)} />
              <rect x="183" y="223" width="34" height="48" fill="url(#bp-warm)" className={`bp-fade ${on(6) ? "on" : ""}`} style={d(2)} />
              <rect x="183" y="223" width="34" height="48" className={`bp-door ${on(3) ? "shown" : ""} ${on(6) ? "on" : ""}`} />
              <g className={`bp-key ${on(6) ? "on" : ""}`}>
                <circle cx="184" cy="48" r="10" className="bp-key-line" />
                <path d="M194 48 H226 M216 48 V56 M223 48 V54" className="bp-key-line" />
              </g>
            </g>
          </svg>

          {/* Progress */}
          <div className="absolute inset-x-5 bottom-4 z-10 flex gap-1.5 lg:inset-x-7 lg:bottom-6" aria-hidden>
            {steps.map((s, i) => (
              <span key={s.n} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/10">
                <span className={`bp-seg block h-full rounded-full ${on(i) ? "on" : ""}`} />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Chapters */}
      <ol ref={listRef} className="relative pt-6 lg:pt-0">
        {steps.map((s, i) => {
          const isActive = !ready || i === active;
          return (
            <li
              key={s.n}
              data-chapter={i}
              className="flex min-h-[58svh] flex-col justify-center py-8 lg:min-h-[74svh]"
            >
              <div className={`bp-chapter ${isActive ? "is-active" : ""}`}>
                <div className="flex items-center gap-3">
                  <span className="font-display text-[44px] leading-none text-emerald-text tabular lg:text-[56px]">{s.n}</span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                      s.online ? "bg-forest text-emerald-text" : "bg-sage-deep text-sage-text"
                    }`}
                  >
                    {s.online ? "On this site" : "With Aqil"}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-[30px] leading-tight lg:text-[38px]">{s.title}</h3>
                <p className="mt-3 max-w-md text-[16px] leading-relaxed text-muted lg:text-[17px]">{s.body}</p>
              </div>
            </li>
          );
        })}
        <li className="pt-4 pb-10 lg:pb-[18svh]">
          <div className="relative overflow-hidden rounded-[24px] border border-line bg-[linear-gradient(135deg,rgba(28,74,55,0.75),rgba(47,61,51,0.6))] p-7">
            <span aria-hidden className="absolute -top-16 -right-10 size-48 rounded-full bg-emerald/20 blur-3xl" />
            <span aria-hidden className="relative grid size-11 place-items-center rounded-full bg-emerald/15 text-emerald-text ring-1 ring-emerald-text/30">
              <KeyRound size={20} />
            </span>
            <p className="relative mt-4 font-display text-[26px] leading-tight">Ready to start your journey?</p>
            <p className="relative mt-2 max-w-md text-[15px] text-muted">
              Tell Aqil what you need and he will shortlist for you.
            </p>
            <Link href="/enquire" className="btn btn-primary relative mt-5">
              Get a recommendation
            </Link>
          </div>
        </li>
      </ol>
    </div>
  );
}

/** Stagger within one step's drawing */
function d(i: number): CSSProperties {
  return { transitionDelay: `${i * 110}ms` };
}

function Line({ d: path, on, i, dim }: { d: string; on: boolean; i: number; dim?: boolean }) {
  return <path d={path} pathLength={1} className={`bp-line ${dim ? "dim" : ""} ${on ? "on" : ""}`} style={d(i)} />;
}

function Rect({ x, y, w, h, on, i }: { x: number; y: number; w: number; h: number; on: boolean; i: number }) {
  return <rect x={x} y={y} width={w} height={h} rx="2" pathLength={1} className={`bp-line ${on ? "on" : ""}`} style={d(i)} />;
}
