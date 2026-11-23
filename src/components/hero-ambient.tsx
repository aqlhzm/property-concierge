"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   Living hero: a few birds crossing the sky now and then, drawn in code on top
   of the real photograph (no generated video), plus an optional nature sound.
   Nothing moves with reduced motion; nothing plays until the visitor asks.
   ───────────────────────────────────────────────────────────────────────────── */

type Bird = {
  x: number;
  y: number;
  vx: number;
  size: number; // half wingspan in px
  phase: number;
  freq: number; // flaps per second
  glideSeed: number;
  bobSeed: number;
  alpha: number;
};

const rand = (a: number, b: number) => a + Math.random() * (b - a);

/** Birds layer: sits between the photo and the copy shading. */
export function HeroBirds() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let birds: Bird[] = [];
    let nextFlockAt = performance.now() + 2200;

    const spawnFlock = () => {
      const fromRight = Math.random() < 0.6;
      const count = Math.round(rand(2, 5));
      const depth = rand(0, 1); // 0 far, 1 near
      const size = (w < 640 ? 4 : 5.5) + depth * (w < 640 ? 3 : 4.5);
      const speed = (24 + depth * 26) * (w < 640 ? 0.8 : 1);
      const y0 = h * rand(0.1, 0.32);
      const x0 = fromRight ? w + 40 : -40;
      const dir = fromRight ? -1 : 1;
      for (let i = 0; i < count; i++) {
        // loose V: each bird a little behind and to one side of the leader
        const rank = Math.ceil(i / 2);
        const side = i % 2 === 0 ? 1 : -1;
        birds.push({
          x: x0 - dir * rank * size * rand(3.2, 4.4),
          y: y0 + side * rank * size * rand(1.6, 2.4) + rand(-2, 2),
          vx: dir * speed * rand(0.94, 1.06),
          size: size * rand(0.88, 1.08),
          phase: rand(0, Math.PI * 2),
          freq: rand(2.4, 3.3),
          glideSeed: rand(0, 1000),
          bobSeed: rand(0, 1000),
          alpha: 0.5 + depth * 0.32,
        });
      }
    };

    const drawBird = (b: Bird, t: number) => {
      // Alternate flapping and gliding, as real birds do
      const glide = (Math.sin(t * 0.55 + b.glideSeed) + 1) / 2; // 0..1
      const flapping = glide > 0.42 ? 1 : glide / 0.42;
      const flap = Math.sin(t * b.freq * Math.PI * 2 + b.phase) * flapping;
      const s = b.size;
      const lift = s * (0.15 + 0.55 * flap); // wing tip height above body
      const x = b.x;
      const y = b.y + Math.sin(t * 0.8 + b.bobSeed) * s * 0.35;
      ctx.beginPath();
      ctx.moveTo(x - s, y - lift);
      ctx.quadraticCurveTo(x - s * 0.45, y - lift * 0.15 - s * 0.18, x, y);
      ctx.quadraticCurveTo(x + s * 0.45, y - lift * 0.15 - s * 0.18, x + s, y - lift);
      ctx.strokeStyle = `rgba(24, 30, 26, ${b.alpha})`;
      ctx.lineWidth = Math.max(1, s * 0.3);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
    };

    let raf = 0;
    let last = performance.now();
    let running = false;
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = now / 1000;
      if (now >= nextFlockAt) {
        spawnFlock();
        nextFlockAt = now + rand(9000, 17000);
      }
      ctx.clearRect(0, 0, w, h);
      birds = birds.filter((b) => b.x > -80 && b.x < w + 80);
      for (const b of birds) {
        b.x += b.vx * dt;
        b.y += Math.sin(t * 0.3 + b.bobSeed) * 0.04; // gentle drift
        drawBird(b, t);
      }
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !document.hidden) start();
      else stop();
    });
    io.observe(canvas);
    const onVis = () => (document.hidden || !visible ? stop() : start());
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" style={{ zIndex: -15 }} />;
}

/** Nature sound toggle. Loads and plays only after a tap; loops without a gap (Web Audio). */
export function HeroSound({ src }: { src: string }) {
  const [on, setOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const audio = useRef<{ ctx: AudioContext; gain: GainNode; source?: AudioBufferSourceNode; buffer?: AudioBuffer } | null>(
    null,
  );
  const wanted = useRef(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  const fadeTo = (value: number, seconds: number) => {
    const a = audio.current;
    if (!a) return;
    const now = a.ctx.currentTime;
    a.gain.gain.cancelScheduledValues(now);
    a.gain.gain.setValueAtTime(a.gain.gain.value, now);
    a.gain.gain.linearRampToValueAtTime(value, now + seconds);
  };

  const ensureSource = () => {
    const a = audio.current;
    if (!a?.buffer || a.source) return;
    const s = a.ctx.createBufferSource();
    s.buffer = a.buffer;
    s.loop = true;
    s.connect(a.gain);
    s.start();
    a.source = s;
  };

  async function toggle() {
    if (on) {
      wanted.current = false;
      setOn(false);
      fadeTo(0, 0.8);
      return;
    }
    wanted.current = true;
    setOn(true);
    try {
      if (!audio.current) {
        setLoading(true);
        const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new Ctx();
        const gain = ctx.createGain();
        gain.gain.value = 0;
        gain.connect(ctx.destination);
        audio.current = { ctx, gain };
        const res = await fetch(src);
        const data = await res.arrayBuffer();
        audio.current.buffer = await ctx.decodeAudioData(data);
        setLoading(false);
      }
      await audio.current.ctx.resume();
      ensureSource();
      if (wanted.current) fadeTo(0.55, 1.6);
    } catch {
      setLoading(false);
      setOn(false);
      wanted.current = false;
    }
  }

  // Fade out when the hero leaves the screen or the tab is hidden; back in on return.
  useEffect(() => {
    const el = btnRef.current;
    if (!el) return;
    let inView = true;
    const apply = () => {
      if (!audio.current || !wanted.current) return;
      if (inView && !document.hidden) {
        audio.current.ctx.resume().then(() => fadeTo(0.55, 1.2));
      } else {
        fadeTo(0, 0.6);
      }
    };
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      apply();
    });
    io.observe(el.closest("section") ?? el);
    document.addEventListener("visibilitychange", apply);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", apply);
    };
  }, []);

  useEffect(() => () => void audio.current?.ctx.close(), []);

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? "Turn nature sound off" : "Turn nature sound on"}
      className="glass-photo inline-flex min-h-11 items-center gap-2 rounded-full px-3.5 text-[12px] font-medium text-white/90 transition-transform duration-200 active:scale-95"
    >
      {on ? <Volume2 aria-hidden size={16} className={loading ? "animate-pulse" : ""} /> : <VolumeX aria-hidden size={16} />}
      <span className="hidden sm:inline">{on ? "Nature sound on" : "Nature sound"}</span>
    </button>
  );
}
