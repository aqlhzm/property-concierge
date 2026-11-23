"use client";

import { ArrowRight, KeyRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type JourneyStep = { n: string; title: string; body: string; online: boolean };

export type JourneyFilm = {
  /** Scroll-scrubbed film: blueprint (first frame) to the finished home (last frame) */
  src: string;
  /** Smaller encode for phones */
  srcSmall: string;
  /** VP9 encode for browsers without H.264 */
  srcVp9: string;
  /** First frame (blueprint) */
  poster: string;
  /** Last frame (finished home), shown with reduced motion */
  still: string;
};

/** Share of the scroll that drives the film; the rest holds on the finished home with the CTA. */
const FILM_SHARE = 0.86;

/**
 * The concierge journey as a scroll-driven film, in the manner of Apple product pages:
 * the reader's scroll turns a blueprint of a real development into the finished home,
 * while each step of the journey takes its turn on a glass panel. Native scrolling
 * (the page is never hijacked); the film follows the scroll with a light easing.
 * With reduced motion, the finished home and every step show as a still layout.
 */
export function Journey({ steps, film }: { steps: JourneyStep[]; film: JourneyFilm }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mode, setMode] = useState<"film" | "still">("film");
  const [active, setActive] = useState(0);
  const [done, setDone] = useState(false);
  const total = steps.length;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-off: respect the reader's motion setting
      setMode("still");
      return;
    }
    const wrap = wrapRef.current;
    const video = videoRef.current;
    if (!wrap || !video) return;

    const h264 = video.canPlayType('video/mp4; codecs="avc1.640028"') !== "";
    video.src = !h264 ? film.srcVp9 : window.matchMedia("(min-width: 768px)").matches ? film.src : film.srcSmall;
    video.load();
    // iOS only paints seeked frames once the video has played: play muted, then pause.
    video.play().then(() => video.pause()).catch(() => {});

    let raf = 0;
    let shown = 0;
    let lastStep = -1;
    let lastDone = false;
    const tick = () => {
      const r = wrap.getBoundingClientRect();
      const scrollable = r.height - window.innerHeight;
      const p = scrollable > 0 ? Math.min(1, Math.max(0, -r.top / scrollable)) : 0;
      const f = Math.min(1, p / FILM_SHARE);
      wrap.style.setProperty("--f", f.toFixed(4));

      // Film follows the scroll with a light easing (never more than ~4 frames behind)
      const dur = video.duration || 0;
      if (dur > 0) {
        shown += (f - shown) * 0.14;
        if (Math.abs(f - shown) < 0.0005) shown = f;
        const t = Math.min(dur - 0.04, shown * dur);
        if (!video.seeking && Math.abs(video.currentTime - t) > 0.01) video.currentTime = t;
      }

      const step = Math.min(total - 1, Math.floor(f * total));
      if (step !== lastStep) {
        lastStep = step;
        setActive(step);
      }
      const isDone = p > FILM_SHARE + 0.02;
      if (isDone !== lastDone) {
        lastDone = isDone;
        setDone(isDone);
      }
      raf = requestAnimationFrame(tick);
    };

    // Only run while the section is near the screen
    const io = new IntersectionObserver(
      ([e]) => {
        cancelAnimationFrame(raf);
        if (e.isIntersecting) raf = requestAnimationFrame(tick);
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(wrap);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [total, film.src, film.srcSmall, film.srcVp9]);

  /** Jump to a step: scroll to the middle of its part of the film */
  function goTo(i: number) {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const top = wrap.getBoundingClientRect().top + window.scrollY;
    const scrollable = wrap.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + ((i + 0.5) / total) * FILM_SHARE * scrollable, behavior: "smooth" });
  }

  if (mode === "still") return <JourneyStill steps={steps} film={film} />;

  return (
    <div ref={wrapRef} className="journey-film relative" style={{ height: `${(total + 1) * 85}svh` }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-[#0b120e]">
        {/* Film: full bleed on desktop; full width 16:9 on phones so both homes stay in view */}
        <div className="film-frame absolute inset-x-0 top-[92px] aspect-video md:inset-0 md:top-0 md:aspect-auto">
          <video
            ref={videoRef}
            poster={film.poster}
            muted
            playsInline
            preload="auto"
            aria-hidden
            tabIndex={-1}
            disablePictureInPicture
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Phones: fade the film into the page below it */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0b120e] to-transparent md:hidden" />
        </div>

        {/* Desktop legibility: darken the left (copy) and the bottom (progress) */}
        <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(9,14,11,0.82)_0%,rgba(9,14,11,0.5)_30%,transparent_58%)] md:block" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-48 bg-gradient-to-t from-[rgba(9,14,11,0.85)] to-transparent md:block" />
        <div className="pointer-events-none absolute inset-x-0 top-0 hidden h-36 bg-gradient-to-b from-[rgba(9,14,11,0.7)] to-transparent md:block" />

        {/* Chapters */}
        <div className="absolute inset-x-0 bottom-[calc(108px+env(safe-area-inset-bottom))] mx-auto max-w-6xl px-5 sm:px-8 md:top-1/2 md:bottom-auto md:-translate-y-1/2">
          <div className="relative min-h-[230px] md:min-h-[300px] md:max-w-[440px]">
            {steps.map((s, i) => (
              <article
                key={s.n}
                aria-hidden={i !== active || done}
                className={`film-chapter absolute inset-x-0 bottom-0 md:top-0 md:bottom-auto ${i === active && !done ? "is-active" : i < active || done ? "is-past" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-display text-[46px] leading-none text-emerald-text tabular md:text-[64px]">{s.n}</span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                      s.online ? "bg-forest text-emerald-text" : "bg-sage-deep text-sage-text"
                    }`}
                  >
                    {s.online ? "On this site" : "With Aqil"}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-[32px] leading-tight text-white md:text-[46px]">{s.title}</h3>
                <p className="mt-2 max-w-md text-[15px] leading-relaxed text-white/80 md:mt-3 md:text-[17px]">{s.body}</p>
              </article>
            ))}

            {/* Finale: the home is finished; the keys are next */}
            <div aria-hidden={!done} className={`film-chapter absolute inset-x-0 bottom-0 md:top-0 md:bottom-auto ${done ? "is-active" : ""}`}>
              <span className="grid size-12 place-items-center rounded-full bg-[#f6e2ad]/15 text-[#f6e2ad] ring-1 ring-[#f6e2ad]/40">
                <KeyRound size={22} />
              </span>
              <h3 className="mt-4 font-display text-[32px] leading-tight text-white md:text-[46px]">Your keys, handed over.</h3>
              <p className="mt-2 max-w-md text-[15px] text-white/80 md:text-[17px]">
                Tell Aqil what you need and he will shortlist for you.
              </p>
              <Link href="/enquire" tabIndex={done ? 0 : -1} className="btn btn-primary mt-5">
                Get a recommendation <ArrowRight aria-hidden size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* Progress: one segment per step, tap to jump */}
        <nav
          aria-label="Journey steps"
          className="absolute inset-x-0 bottom-[calc(76px+env(safe-area-inset-bottom))] mx-auto max-w-6xl px-5 sm:px-8 md:bottom-8"
        >
          <ol className="grid grid-cols-7 gap-1.5">
            {steps.map((s, i) => (
              <li key={s.n}>
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Step ${s.n}: ${s.title}`}
                  aria-current={i === active && !done ? "step" : undefined}
                  className="group block w-full py-2 text-left"
                >
                  <span className="block h-[3px] overflow-hidden rounded-full bg-white/15">
                    <span className="film-seg block h-full rounded-full" style={{ ["--i" as string]: i }} />
                  </span>
                  <span
                    className={`mt-2 hidden text-[12px] transition-colors duration-300 md:block ${
                      i === active && !done ? "text-white" : "text-white/45 group-hover:text-white/75"
                    }`}
                  >
                    {s.title}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
}

/** Reduced motion: the finished home and every step, still. */
function JourneyStill({ steps, film }: { steps: JourneyStep[]; film: JourneyFilm }) {
  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8">
      {/* eslint-disable-next-line @next/next/no-img-element -- still frame of the film, already sized */}
      <img src={film.still} alt="The finished home, Wellington Garden" className="aspect-video w-full rounded-[24px] object-cover" />
      <ol className="mt-6 grid gap-px overflow-hidden rounded-[20px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s) => (
          <li key={s.n} className="flex flex-col gap-3 bg-surface p-6">
            <span className="font-display text-[22px] text-emerald-text">{s.n}</span>
            <h3 className="text-[18px] font-medium">{s.title}</h3>
            <p className="text-[14px] text-muted">{s.body}</p>
          </li>
        ))}
        <li className="flex flex-col justify-between gap-4 bg-[linear-gradient(135deg,rgba(28,74,55,0.6),rgba(47,61,51,0.6))] p-6">
          <p className="text-[15px]">Ready to start? Tell Aqil what you need and he will shortlist for you.</p>
          <Link href="/enquire" className="btn btn-primary self-start">
            Get a recommendation
          </Link>
        </li>
      </ol>
    </div>
  );
}
