"use client";

import { Expand, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Consultant photo for the home panel.
 * - Larger screens: the photo melts into the copy with a stepped (progressive) blur and a tone gradient.
 * - Click / tap: the photo lifts out of the panel and grows to the full 4:5 portrait in the centre of the
 *   screen (FLIP animation from the panel's crop), then returns to its place on close.
 */

const EASE_OUT = "cubic-bezier(0.2, 0.8, 0.2, 1)";
const EASE_SPRING = "cubic-bezier(0.34, 1.25, 0.64, 1)";
const THUMB_POSITION = "50% 26%";

/** Stepped blur: each layer blurs a little more and starts a little further right, so the edge is seamless. */
const BLUR_STEPS = [
  { blur: 2, from: 62, to: 76 },
  { blur: 5, from: 70, to: 84 },
  { blur: 10, from: 78, to: 92 },
  { blur: 24, from: 86, to: 100 },
];

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type Rect = { top: number; left: number; width: number; height: number };

function targetRect(): Rect {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const height = Math.min(vh * 0.84, ((vw * 0.9) / 4) * 5, 1100);
  const width = (height / 5) * 4;
  return { top: (vh - height) / 2 - 18, left: (vw - width) / 2, width, height };
}

export function ConsultantPhoto({ src, alt, name, title }: { src: string; alt: string; name: string; title: string }) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const thumbRef = useRef<HTMLButtonElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const fromRef = useRef<Rect | null>(null);

  const openPhoto = () => {
    const r = thumbRef.current?.getBoundingClientRect();
    if (!r) return;
    fromRef.current = { top: r.top, left: r.left, width: r.width, height: r.height };
    setOpen(true);
  };

  // Grow from the panel crop to the full portrait.
  useLayoutEffect(() => {
    if (!open || closing) return;
    const box = boxRef.current;
    const from = fromRef.current;
    if (!box || !from) return;
    const to = targetRect();
    Object.assign(box.style, { top: `${to.top}px`, left: `${to.left}px`, width: `${to.width}px`, height: `${to.height}px` });
    closeRef.current?.focus({ preventScroll: true });
    if (reduced()) {
      backdropRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, fill: "both" });
      box.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, fill: "both" });
      captionRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, fill: "both" });
      return;
    }
    box.animate(
      [
        { top: `${from.top}px`, left: `${from.left}px`, width: `${from.width}px`, height: `${from.height}px`, borderRadius: "20px 0 0 20px", boxShadow: "0 0 0 rgba(0,0,0,0)" },
        { top: `${to.top}px`, left: `${to.left}px`, width: `${to.width}px`, height: `${to.height}px`, borderRadius: "24px", boxShadow: "0 40px 120px -20px rgba(0,0,0,0.75)" },
      ],
      { duration: 640, easing: EASE_SPRING, fill: "both" },
    );
    imgWrapRef.current?.animate(
      [{ objectPosition: THUMB_POSITION, transform: "scale(1.04)" }, { objectPosition: "50% 50%", transform: "scale(1)" }],
      { duration: 900, easing: EASE_OUT, fill: "both" },
    );
    backdropRef.current?.animate(
      [{ opacity: 0, backdropFilter: "blur(0px)" }, { opacity: 1, backdropFilter: "blur(18px)" }],
      { duration: 420, easing: EASE_OUT, fill: "both" },
    );
    captionRef.current?.animate(
      [{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "translateY(0)" }],
      { duration: 420, delay: 380, easing: EASE_OUT, fill: "both" },
    );
  }, [open, closing]);

  const closePhoto = useCallback(() => {
    if (!open || closing) return;
    setClosing(true);
    const box = boxRef.current;
    const thumb = thumbRef.current?.getBoundingClientRect();
    const done = () => {
      setOpen(false);
      setClosing(false);
      thumbRef.current?.focus({ preventScroll: true });
    };
    if (!box || !thumb || reduced()) {
      done();
      return;
    }
    const cur = box.getBoundingClientRect();
    captionRef.current?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, easing: EASE_OUT, fill: "both" });
    backdropRef.current?.animate(
      [{ opacity: 1, backdropFilter: "blur(18px)" }, { opacity: 0, backdropFilter: "blur(0px)" }],
      { duration: 420, easing: EASE_OUT, fill: "both" },
    );
    imgWrapRef.current?.animate([{ objectPosition: "50% 50%" }, { objectPosition: THUMB_POSITION }], { duration: 460, easing: EASE_OUT, fill: "both" });
    const anim = box.animate(
      [
        { top: `${cur.top}px`, left: `${cur.left}px`, width: `${cur.width}px`, height: `${cur.height}px`, borderRadius: "24px" },
        { top: `${thumb.top}px`, left: `${thumb.left}px`, width: `${thumb.width}px`, height: `${thumb.height}px`, borderRadius: "20px 0 0 20px" },
      ],
      { duration: 460, easing: EASE_OUT, fill: "both" },
    );
    anim.onfinish = done;
  }, [open, closing]);

  // Esc, scroll lock and resize while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closePhoto();
    const onResize = () => {
      const box = boxRef.current;
      if (!box || closing) return;
      box.getAnimations().forEach((a) => a.cancel());
      const to = targetRect();
      Object.assign(box.style, { top: `${to.top}px`, left: `${to.left}px`, width: `${to.width}px`, height: `${to.height}px`, borderRadius: "24px" });
    };
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open, closing, closePhoto]);

  return (
    <>
      <button
        ref={thumbRef}
        type="button"
        onClick={openPhoto}
        aria-label={`View ${name}'s portrait`}
        aria-haspopup="dialog"
        className="group/photo relative block aspect-[4/5] w-full cursor-zoom-in overflow-hidden text-left md:absolute md:inset-0 md:aspect-auto"
        style={{ opacity: open ? 0 : 1 }}
      >
        <Image
          src={src}
          quality={90}
          alt={alt}
          fill
          sizes="(min-width: 1152px) 460px, (min-width: 768px) 42vw, 100vw"
          className="object-cover transition-transform duration-[1400ms] ease-apple group-hover/photo:scale-[1.04]"
          style={{ objectPosition: THUMB_POSITION }}
        />
        {/* Progressive blur toward the copy (larger screens) */}
        {BLUR_STEPS.map((s) => (
          <div
            key={s.blur}
            aria-hidden
            className="pointer-events-none absolute inset-0 hidden md:block"
            style={{
              backdropFilter: `blur(${s.blur}px)`,
              WebkitBackdropFilter: `blur(${s.blur}px)`,
              maskImage: `linear-gradient(to right, transparent ${s.from}%, black ${s.to}%)`,
              WebkitMaskImage: `linear-gradient(to right, transparent ${s.from}%, black ${s.to}%)`,
            }}
          />
        ))}
        {/* Tone: into the copy below on phones, into the panel on larger screens */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,var(--surface)_0%,transparent_24%)] md:bg-[linear-gradient(to_right,transparent_58%,color-mix(in_oklab,var(--surface)_35%,transparent)_76%,color-mix(in_oklab,var(--surface)_82%,transparent)_92%,var(--surface)_100%)]"
        />
        <span className="glass-photo pointer-events-none absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium text-white/90 transition-all duration-300 ease-apple md:translate-y-1 md:opacity-0 md:group-hover/photo:translate-y-0 md:group-hover/photo:opacity-100 md:group-focus-visible/photo:translate-y-0 md:group-focus-visible/photo:opacity-100">
          <Expand aria-hidden size={13} /> View portrait
        </span>
      </button>

      {open &&
        createPortal(
          <div role="dialog" aria-modal="true" aria-label={`${name}, portrait`} className="fixed inset-0 z-[60]">
            <div ref={backdropRef} className="absolute inset-0 bg-[rgba(6,10,8,0.78)]" onClick={closePhoto} />
            <div ref={boxRef} className="fixed overflow-hidden" style={{ borderRadius: 24 }} onClick={closePhoto}>
              <div ref={imgWrapRef} className="absolute inset-0" style={{ objectPosition: THUMB_POSITION }}>
                <Image src={src} alt={alt} fill quality={90} sizes="(min-width: 1024px) 720px, 92vw" className="object-cover" style={{ objectPosition: "inherit" }} priority />
              </div>
            </div>
            <div
              ref={captionRef}
              className="pointer-events-none fixed inset-x-0 bottom-[max(1.25rem,env(safe-area-inset-bottom))] flex justify-center px-5"
            >
              <div className="glass pointer-events-auto flex items-center gap-4 rounded-full py-2 pr-2 pl-5">
                <p className="text-[14px]">
                  <span className="font-medium">{name}</span> <span className="text-muted">· {title}</span>
                </p>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={closePhoto}
                  aria-label="Close portrait"
                  className="grid size-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                >
                  <X aria-hidden size={18} />
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
