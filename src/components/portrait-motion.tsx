"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A silent, looping motion version of a portrait, laid exactly over its still image.
 * The still stays underneath and shows first; the video fades in only once it is
 * actually playing. Nothing is downloaded for reduced motion or Save-Data, where the
 * still remains.
 */
export function PortraitMotion({
  large,
  small,
  className,
}: {
  large: string;
  small: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduce.matches || saveData) return;

    video.src = window.matchMedia("(min-width: 768px)").matches ? large : small;
    video.play().catch(() => {});

    const onChange = () => {
      if (reduce.matches) {
        video.pause();
        setPlaying(false);
      } else {
        video.play().catch(() => {});
      }
    };
    reduce.addEventListener("change", onChange);
    return () => {
      reduce.removeEventListener("change", onChange);
      video.pause();
    };
  }, [large, small]);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden
      tabIndex={-1}
      disablePictureInPicture
      onPlaying={() => setPlaying(true)}
      className={`pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-700 ease-out ${
        playing ? "opacity-100" : "opacity-0"
      } ${className ?? ""}`}
    />
  );
}
