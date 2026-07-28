"use client";

import { useEffect, useRef } from "react";
import { shouldAnimate } from "@/lib/utils";
import { FRAG_SHADER, VERT_SHADER } from "@/components/gl/hero-shader";

/** Internal render scale — the field is soft, so upscaling is invisible. */
const RENDER_SCALE = 0.8;

/** Wordmark texture resolution. Power-of-two keeps WebGL 1 happy. */
const TEX_W = 2048;
const TEX_H = 512;

const WORDMARK = "YASHVANTH";

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/** Renders the wordmark to an offscreen canvas for use as a luminance mask. */
function drawWordmark(): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = TEX_W;
  c.height = TEX_H;
  const ctx = c.getContext("2d");
  if (!ctx) return c;

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, TEX_W, TEX_H);

  /* Fit the word to the texture width with a small margin. */
  const family =
    getComputedStyle(document.body).getPropertyValue("font-family") ||
    "system-ui, sans-serif";
  let size = 400;
  ctx.font = `600 ${size}px ${family}`;
  const target = TEX_W * 0.94;
  const measured = ctx.measureText(WORDMARK).width;
  size = Math.floor(size * (target / measured));

  ctx.font = `600 ${size}px ${family}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#fff";
  ctx.letterSpacing = "-0.03em";
  ctx.fillText(WORDMARK, TEX_W / 2, TEX_H / 2);

  return c;
}

/**
 * Signature WebGL hero background. Raw GL — no three.js: one program,
 * one fullscreen triangle, and the wordmark carried as a texture that
 * the noise field warps and the cursor shreds.
 *
 * Deferred to idle so it never competes with LCP, paused when offscreen
 * or backgrounded, and it simply never covers the CSS `.hero-fallback`
 * gradient if anything fails.
 */
export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!shouldAnimate()) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let raf = 0;
    let gl: WebGLRenderingContext | null = null;
    let program: WebGLProgram | null = null;
    let buffer: WebGLBuffer | null = null;
    let texture: WebGLTexture | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let intersectionObserver: IntersectionObserver | null = null;
    let resizeTimer = 0;
    const cleanupFns: Array<() => void> = [];

    /* Pointer is lerped in JS; the shader just reads the uniform. */
    const pointer = { x: 0.5, y: 0.5 };
    const target = { x: 0.5, y: 0.5 };
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    /* How hard the cursor is currently tearing the wordmark apart.
       Ramps up while the pointer moves, decays when it rests. */
    let disturb = 0;
    let disturbTarget = 0;
    let lastMove = 0;

    let visible = true;
    let running = false;
    let elapsed = 0;
    let lastFrame = 0;

    const init = () => {
      if (disposed) return;

      gl = canvas.getContext("webgl", {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: "low-power",
      }) as WebGLRenderingContext | null;
      if (!gl) return; // fallback gradient stays visible

      const vs = compile(gl, gl.VERTEX_SHADER, VERT_SHADER);
      const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG_SHADER);
      if (!vs || !fs) return;

      program = gl.createProgram();
      if (!program) return;
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
      gl.useProgram(program);

      /* One oversized triangle covers the viewport — no quad, no indices. */
      buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 3, -1, -1, 3]),
        gl.STATIC_DRAW
      );
      const loc = gl.getAttribLocation(program, "a_pos");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

      /* Wordmark texture */
      texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        drawWordmark()
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.activeTexture(gl.TEXTURE0);
      gl.uniform1i(gl.getUniformLocation(program, "u_text"), 0);

      const uRes = gl.getUniformLocation(program, "u_res");
      const uTime = gl.getUniformLocation(program, "u_time");
      const uPointer = gl.getUniformLocation(program, "u_pointer");
      const uDisturb = gl.getUniformLocation(program, "u_disturb");
      const uTextScale = gl.getUniformLocation(program, "u_textScale");
      const uTextOffset = gl.getUniformLocation(program, "u_textOffset");

      const resize = () => {
        if (!gl || disposed) return;
        const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.25 : 1.75);
        const w = Math.max(1, Math.round(canvas.clientWidth * dpr * RENDER_SCALE));
        const h = Math.max(1, Math.round(canvas.clientHeight * dpr * RENDER_SCALE));
        if (canvas.width === w && canvas.height === h) return;
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
        gl.uniform2f(uRes, w, h);

        /* Fit the wordmark to a share of the viewport width, preserving its
           own aspect so the letters never stretch.
         *
         * Placement matters as much as size. The headline runs down the
         * left column, so on a pointer device the wordmark is anchored into
         * the empty lower-right quadrant and allowed to bleed off the right
         * edge — centred, it lands squarely across "Sankar." and reads as a
         * duplicated headline instead of scenery behind one.
         *
         * A coarse screen has no free column, so it keeps the oversized
         * centred fit: at that scale only two or three letterforms are on
         * screen and it reads as texture, never as a second copy. */
        const texAspect = TEX_W / TEX_H;
        const viewAspect = w / h;
        const coverage = coarse ? 1.05 : 0.46;
        const scaleX = 1 / coverage;
        const scaleY = (scaleX * texAspect) / viewAspect;
        gl.uniform2f(uTextScale, scaleX, scaleY);
        /* Far enough right to clear the role line where it wraps to two
           lines on a ~1024px window, which is the tightest desktop case. */
        gl.uniform2f(uTextOffset, coarse ? 0 : 0.33, coarse ? 0 : -0.215);
      };
      resize();

      const render = (now: number) => {
        if (disposed || !gl) return;

        /* Advance our own clock so pausing never causes a time jump. */
        const delta = lastFrame ? Math.min(now - lastFrame, 50) : 16;
        lastFrame = now;
        elapsed += delta;

        if (coarse) {
          /* No cursor to follow — slow autonomous drift keeps it alive. */
          const t = elapsed * 0.0001;
          target.x = 0.5 + Math.sin(t * 1.3) * 0.28;
          target.y = 0.5 + Math.cos(t) * 0.24;
          disturbTarget = 0.35;
        } else if (now - lastMove > 260) {
          /* Cursor at rest — let the letters knit back together. */
          disturbTarget = 0;
        }

        pointer.x += (target.x - pointer.x) * 0.06;
        pointer.y += (target.y - pointer.y) * 0.06;
        disturb += (disturbTarget - disturb) * 0.055;

        gl.uniform1f(uTime, elapsed * 0.001);
        gl.uniform2f(uPointer, pointer.x, pointer.y);
        gl.uniform1f(uDisturb, disturb);
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        raf = requestAnimationFrame(render);
      };

      const start = () => {
        if (running || disposed) return;
        running = true;
        lastFrame = 0;
        raf = requestAnimationFrame(render);
      };
      const stop = () => {
        running = false;
        cancelAnimationFrame(raf);
      };

      const onVisibility = () => {
        if (document.hidden || !visible) stop();
        else start();
      };

      intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
          onVisibility();
        },
        { threshold: 0 }
      );
      intersectionObserver.observe(canvas);

      resizeObserver = new ResizeObserver(() => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(resize, 150);
      });
      resizeObserver.observe(canvas);

      document.addEventListener("visibilitychange", onVisibility);

      const onPointerMove = (e: PointerEvent) => {
        target.x = e.clientX / window.innerWidth;
        target.y = 1 - e.clientY / window.innerHeight;
        disturbTarget = 1;
        lastMove = performance.now();
      };
      if (!coarse) window.addEventListener("pointermove", onPointerMove, { passive: true });

      const onContextLost = (e: Event) => {
        e.preventDefault();
        stop();
        canvas.style.opacity = "0";
      };
      const onContextRestored = () => {
        canvas.style.opacity = "0";
        init();
      };
      canvas.addEventListener("webglcontextlost", onContextLost);
      canvas.addEventListener("webglcontextrestored", onContextRestored);

      start();
      /* Fade in only once there's something real on the canvas. */
      requestAnimationFrame(() => {
        if (!disposed) canvas.style.opacity = "1";
      });

      cleanupFns.push(() => {
        stop();
        document.removeEventListener("visibilitychange", onVisibility);
        window.removeEventListener("pointermove", onPointerMove);
        canvas.removeEventListener("webglcontextlost", onContextLost);
        canvas.removeEventListener("webglcontextrestored", onContextRestored);
      });
    };

    /* Defer past first paint — the hero headline is the LCP element.
       Fonts first, so the wordmark texture uses Geist, not a fallback. */
    let idleId: number | undefined;
    const schedule = () => {
      const ric =
        window.requestIdleCallback ??
        ((cb: IdleRequestCallback) => window.setTimeout(() => cb({} as IdleDeadline), 200));
      idleId = ric(() => init()) as unknown as number;
    };
    if (document.fonts?.status === "loaded") schedule();
    else if (document.fonts) document.fonts.ready.then(schedule);
    else schedule();

    return () => {
      disposed = true;
      window.clearTimeout(resizeTimer);
      cancelAnimationFrame(raf);
      cleanupFns.forEach((fn) => fn());
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      if (idleId !== undefined) {
        window.cancelIdleCallback?.(idleId);
        window.clearTimeout(idleId);
      }
      if (gl) {
        if (buffer) gl.deleteBuffer(buffer);
        if (texture) gl.deleteTexture(texture);
        if (program) gl.deleteProgram(program);
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="hero-fallback" />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full transition-opacity duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ opacity: 0 }}
      />
      {/* Bottom fade so the hero dissolves into the page under the curtain */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[var(--bg-0)]" />
    </div>
  );
}
