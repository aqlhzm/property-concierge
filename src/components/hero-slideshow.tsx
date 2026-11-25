"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

export type HeroSlide = {
  /** Development and location shown in the corner label */
  name: string;
  alt: string;
  /** 16:9 clip and its first frame (larger screens) */
  video: string;
  poster: string;
  /** 9:16 clip and its first frame (phones) */
  videoPortrait: string;
  posterPortrait: string;
};

const FADE_MS = 1600;
/** Clips play a touch slower than recorded: calmer, and each place stays on screen about 6 seconds */
const RATE = 0.85;
/** Start the crossfade this long (in clip time) before a clip ends, so motion never stops on screen */
const LEAD_S = (FADE_MS / 1000) * RATE + 0.15;
/** Without video (reduced motion, data saver), stills change at this pace */
const STILL_MS = 6500;

/**
 * Hero background: a slideshow of short, nearly still clips (cinemagraphs) that crossfade into each
 * other. Phones get portrait cuts, larger screens landscape. Only the playing clip and the next one load;
 * playback pauses off screen and in background tabs. With reduced motion or data saver it shows the
 * stills instead, and the first still is the server-rendered image so the page paints straight away.
 */
const PORTRAIT_MQ = "(max-aspect-ratio: 4/5)";

function subscribePortrait(cb: () => void) {
  const mq = window.matchMedia(PORTRAIT_MQ);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
const noSubscribe = () => () => {};

/** null on the server (decide after hydration); otherwise whether motion and data allow video */
function videoAllowed(): boolean {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return !reduce && !conn?.saveData;
}

export function HeroSlideshow({ slides, note }: { slides: HeroSlide[]; note?: string }) {
  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState(false);
  const portrait = useSyncExternalStore(subscribePortrait, () => window.matchMedia(PORTRAIT_MQ).matches, () => false);
  const allowed = useSyncExternalStore<boolean | null>(noSubscribe, videoAllowed, () => null);
  const mode: "pending" | "video" | "still" = allowed === null ? "pending" : allowed && !failed ? "video" : "still";
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const root = useRef<HTMLDivElement>(null);
  const visible = useRef(true);

  // Stills mode: a slow crossfade between photographs.
  useEffect(() => {
    if (mode !== "still") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // hold the first image
    const t = window.setInterval(() => setActive((i) => (i + 1) % slides.length), STILL_MS);
    return () => window.clearInterval(t);
  }, [mode, slides.length]);

  // Video mode: play the active clip; hand over to the next one shortly before it ends.
  useEffect(() => {
    if (mode !== "video") return;
    const v = videos.current[active];
    if (!v) return;
    let handed = false;
    v.currentTime = 0;
    v.playbackRate = RATE;
    v.defaultPlaybackRate = RATE;
    if (visible.current && !document.hidden) v.play().catch((e: Error) => e.name === "NotAllowedError" && setFailed(true));
    const onTime = () => {
      if (handed || !v.duration) return;
      if (v.currentTime >= v.duration - LEAD_S) {
        handed = true;
        setActive((i) => (i + 1) % slides.length);
      }
    };
    v.addEventListener("timeupdate", onTime);
    // Warm up the next clip while this one plays
    const next = videos.current[(active + 1) % slides.length];
    if (next && next.preload !== "auto") {
      next.preload = "auto";
      next.load();
    }
    return () => v.removeEventListener("timeupdate", onTime);
  }, [active, mode, portrait, slides.length]);

  // Pause off screen and in background tabs.
  useEffect(() => {
    if (mode !== "video") return;
    const el = root.current;
    const sync = () => {
      const v = videos.current[active];
      if (!v) return;
      if (visible.current && !document.hidden) v.play().catch(() => {});
      else v.pause();
    };
    const io = new IntersectionObserver(([e]) => {
      visible.current = e.isIntersecting;
      sync();
    });
    if (el) io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [active, mode]);

  const first = slides[0];
  return (
    <>
      <div ref={root} aria-hidden className="absolute inset-0 -z-20 overflow-hidden bg-[#0b120e]">
        {/* Server rendered first frame: paints immediately and is the LCP image */}
        <picture>
          <source media={PORTRAIT_MQ} srcSet={first.posterPortrait} />
          <Image src={first.poster} alt="" fill priority sizes="100vw" quality={85} className="object-cover" />
        </picture>

        {mode !== "pending" &&
          slides.map((s, i) => {
            const on = i === active;
            const style = { transitionDuration: `${FADE_MS}ms` };
            return mode === "video" ? (
              <video
                key={`${s.name}-${portrait ? "p" : "l"}`}
                ref={(el) => {
                  videos.current[i] = el;
                }}
                className={`absolute inset-0 size-full object-cover transition-opacity ease-in-out ${on ? "opacity-100" : "opacity-0"}`}
                style={style}
                src={portrait ? s.videoPortrait : s.video}
                poster={portrait ? s.posterPortrait : s.poster}
                muted
                playsInline
                preload={i === 0 ? "auto" : "none"}
                disablePictureInPicture
                disableRemotePlayback
              />
            ) : (
              <Image
                key={`${s.name}-${portrait ? "p" : "l"}`}
                src={portrait ? s.posterPortrait : s.poster}
                alt=""
                fill
                sizes="100vw"
                quality={85}
                className={`object-cover transition-opacity ease-in-out ${on ? "opacity-100" : "opacity-0"}`}
                style={style}
              />
            );
          })}
      </div>

      {/* Which development is on screen; aligned with the right edge of the nav pill */}
      <div className="pointer-events-none absolute inset-x-0 top-[calc(58px+var(--safe-top))] px-3 sm:top-[92px] sm:px-6">
        <div className="mx-auto flex max-w-6xl justify-end pr-1.5 sm:pr-2">
          <span
            key={slides[active].name}
            title={note}
            className="hero-slide-label pointer-events-auto inline-flex h-7 items-center gap-1.5 rounded-full border border-white/15 bg-black/40 pr-3 pl-2.5 text-[12px] leading-none font-medium text-white/90 shadow-[0_4px_16px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:h-8 sm:text-[13px]"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-3.5 shrink-0 text-emerald-300" fill="currentColor">
              <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
            </svg>
            <span className="whitespace-nowrap">{slides[active].name}</span>
          </span>
        </div>
      </div>
    </>
  );
}
