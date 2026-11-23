"use client";

import { useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   Living hero: a few birds crossing the sky now and then, drawn in code on top
   of the real photograph (no generated video). Nothing moves with reduced motion.
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
    let nextFlockAt = performance.now() + 6000;

    const spawnFlock = () => {
      const fromRight = Math.random() < 0.6;
      const count = Math.random() < 0.25 ? 1 : Math.random() < 0.7 ? 2 : 3;
      const depth = rand(0, 1); // 0 far, 1 near
      const size = (w < 640 ? 2.4 : 2.8) + depth * (w < 640 ? 1.2 : 1.6);
      const speed = (16 + depth * 12) * (w < 640 ? 0.8 : 1);
      const y0 = h * rand(0.12, 0.28);
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
          alpha: 0.3 + depth * 0.2,
        });
      }
    };

    const drawBird = (b: Bird, t: number) => {
      // Alternate flapping and gliding, as real birds do
      const glide = (Math.sin(t * 0.55 + b.glideSeed) + 1) / 2; // 0..1
      const flapping = glide > 0.42 ? 1 : glide / 0.42;
      const flap = Math.sin(t * b.freq * Math.PI * 2 + b.phase) * flapping;
      const s = b.size;
      const lift = s * (0.2 + 0.38 * flap); // wing tip height above body
      const x = b.x;
      const y = b.y + Math.sin(t * 0.8 + b.bobSeed) * s * 0.35;
      ctx.beginPath();
      ctx.moveTo(x - s, y - lift);
      ctx.quadraticCurveTo(x - s * 0.45, y - lift * 0.15 - s * 0.18, x, y);
      ctx.quadraticCurveTo(x + s * 0.45, y - lift * 0.15 - s * 0.18, x + s, y - lift);
      // hazy slate, like distant birds against a bright sky (not black)
      ctx.strokeStyle = `rgba(58, 68, 80, ${b.alpha})`;
      ctx.lineWidth = Math.max(0.9, s * 0.28);
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
      // one small group at a time, now and then
      if (now >= nextFlockAt && birds.length === 0) {
        spawnFlock();
        nextFlockAt = now + rand(22000, 40000);
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
