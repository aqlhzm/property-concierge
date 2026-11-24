"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

export type HeroSlide = {
  /** Short place name shown in the corner label */
  name: string;
  alt: string;
  /** 16:9 clip and its first frame (larger screens) */
  video: string;
  poster: string;
  /** 9:16 clip and its first frame (phones) */
  videoPortrait: string;
  posterPortrait: string;
};

const FADE_MS = 1400;
/** Start the crossfade this long before a clip ends, so motion never stops on screen */
const LEAD_S = FADE_MS / 1000 + 0.15;
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

export function HeroSlideshow({ slides, label }: { slides: HeroSlide[]; label: string }) {
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

      {/* Which place is on screen; the footage is an artist's impression */}
      <span className="absolute top-[68px] right-4 sm:top-24 sm:right-8">
        <span
          key={active}
          className="hero-slide-label inline-block rounded-full border border-white/10 bg-black/35 px-2 py-[2px] text-[10px] font-medium tracking-[0.02em] text-white/80 backdrop-blur-md sm:px-2.5 sm:py-[3px] sm:text-[11px]"
        >
          {label} · {slides[active].name}
        </span>
      </span>
    </>
  );
}
