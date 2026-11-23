"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Cinemagraph of the real hero photograph (no generated video):
 * the sky drifts and the tree tops sway very slightly, guided by a mask made from
 * the photo itself (R = sky, G = trees; the gazebo is held perfectly still), soft
 * cloud shadows pass over the garden, and the whole frame "breathes" with a slow zoom. Drawn with WebGL, capped at 30fps, paused
 * when off screen. If anything fails, the static photo underneath simply stays.
 */

const VERT = `
attribute vec2 a;
varying vec2 vS;
void main() {
  vS = vec2((a.x + 1.0) * 0.5, 1.0 - (a.y + 1.0) * 0.5);
  gl_Position = vec4(a, 0.0, 1.0);
}`;

const FRAG = `
precision mediump float;
varying vec2 vS;
uniform sampler2D uImg;
uniform sampler2D uMask;
uniform float uT;
uniform float uCanvasAspect;
uniform float uImgAspect;

void main() {
  // object-fit: cover, centred
  vec2 p = vS;
  if (uCanvasAspect > uImgAspect) {
    p.y = 0.5 + (vS.y - 0.5) * (uImgAspect / uCanvasAspect);
  } else {
    p.x = 0.5 + (vS.x - 0.5) * (uCanvasAspect / uImgAspect);
  }

  // slow breath: zoom 1.0 to 1.045 and a few pixels of drift, over ~84s
  float b = 0.5 - 0.5 * cos(uT * 6.2831853 / 84.0);
  float z = 1.0 + 0.045 * b;
  p = vec2(0.5, 0.5) + (p - vec2(0.5, 0.5)) / z + vec2(-0.004, -0.003) * b;

  vec4 m = texture2D(uMask, p);
  float sky = m.r * m.r;
  float tree = m.g;

  // sky: slow drift (70s) and a gentle billow, so clouds feel like they move
  float drift = 0.0042 * sin(uT * 6.2831853 / 70.0);
  vec2 billow = vec2(
    sin(p.y * 9.0 + uT * 0.21) + sin(p.x * 5.0 - uT * 0.13),
    sin(p.x * 7.0 + uT * 0.17)
  ) * 0.0009;
  vec2 dSky = (vec2(drift, 0.0) + billow) * sky;

  // trees: tops sway most, hedges only a little, in soft irregular gusts
  float height = 0.18 + 0.82 * smoothstep(0.80, 0.30, p.y);
  float gust = 0.55 + 0.45 * sin(uT * 0.37 + sin(uT * 0.11) * 2.0);
  float n = sin(p.y * 42.0 + uT * 1.35 + sin(p.x * 23.0) * 1.6) * 0.6
          + sin(p.y * 95.0 + p.x * 31.0 + uT * 2.2) * 0.4;
  vec2 dTree = vec2(n, n * 0.25) * 0.0011 * height * gust * tree;

  vec3 col = texture2D(uImg, p + dSky + dTree).rgb;

  // cloud shadows: very soft light passing over the garden (never the sky itself)
  vec2 q = p * vec2(2.2, 3.2) + vec2(uT * 0.012, uT * 0.004);
  float shade = sin(q.x * 3.1 + sin(q.y * 2.3)) * 0.5 + sin(q.x * 1.7 - q.y * 2.9 + 1.3) * 0.5;
  float ground = (1.0 - m.r) * smoothstep(0.30, 0.55, p.y);
  col *= 1.0 + shade * 0.035 * ground;

  gl_FragColor = vec4(col, 1.0);
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) return null;
  return s;
}

function loadImage(src: string, cors: boolean) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    if (cors) img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/** Photo aspect (the 4K render is 3840 x 2215). */
const PHOTO_ASPECT = 3840 / 2215;

/** Pick the smallest optimised width that stays sharp on this screen, zoom included. */
function textureUrl(imageUrl: string, canvas: HTMLCanvasElement) {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const cw = canvas.clientWidth * dpr;
  const ch = canvas.clientHeight * dpr;
  const need = Math.max(cw, ch * PHOTO_ASPECT) * 1.05;
  const w = [1200, 1920, 2048, 3840].find((x) => x >= need) ?? 3840;
  return `/_next/image?url=${encodeURIComponent(imageUrl)}&w=${w}&q=85`;
}

export function HeroCinemagraph({ imageUrl, maskSrc }: { imageUrl: string; maskSrc: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false, alpha: false });
    if (!gl) return;

    let disposed = false;
    let raf = 0;
    let running = false;
    let visible = true;
    const t0 = performance.now();
    let lastDraw = 0;
    let imgAspect = 1;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    if (!vs || !fs || !prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uT = gl.getUniformLocation(prog, "uT");
    const uCA = gl.getUniformLocation(prog, "uCanvasAspect");
    const uIA = gl.getUniformLocation(prog, "uImgAspect");
    gl.uniform1i(gl.getUniformLocation(prog, "uImg"), 0);
    gl.uniform1i(gl.getUniformLocation(prog, "uMask"), 1);

    const texture = (unit: number, img: HTMLImageElement) => {
      const t = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
    };

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      gl.uniform1f(uCA, w / h);
    };

    const draw = (now: number) => {
      gl.uniform1f(uT, (now - t0) / 1000);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const frame = (now: number) => {
      if (!running) return;
      if (now - lastDraw >= 33) {
        lastDraw = now;
        draw(now);
      }
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (running || disposed) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const ro = new ResizeObserver(() => {
      resize();
      if (!running) draw(performance.now());
    });
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !document.hidden) start();
      else stop();
    });
    const onVis = () => (document.hidden || !visible ? stop() : start());
    const onLost = (e: Event) => {
      e.preventDefault();
      stop();
      setReady(false);
    };

    Promise.all([loadImage(textureUrl(imageUrl, canvas), false), loadImage(maskSrc, true)])
      .then(([img, mask]) => {
        if (disposed) return;
        imgAspect = img.naturalWidth / img.naturalHeight;
        gl.uniform1f(uIA, imgAspect);
        texture(0, img);
        texture(1, mask);
        resize();
        draw(performance.now());
        setReady(true);
        ro.observe(canvas);
        io.observe(canvas);
        document.addEventListener("visibilitychange", onVis);
        canvas.addEventListener("webglcontextlost", onLost);
      })
      .catch(() => {
        /* keep the static photo */
      });

    return () => {
      disposed = true;
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      canvas.removeEventListener("webglcontextlost", onLost);
    };
  }, [imageUrl, maskSrc]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
      style={{ zIndex: -19 }}
    />
  );
}
