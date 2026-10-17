"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { shouldAnimate } from "@/lib/utils";

/**
 * What a scene gives the lifecycle. The hook owns the context, the clock,
 * the size and the run/pause decisions; the scene owns its GL objects.
 */
export interface GlScene {
  /** After any size change, with the drawing-buffer size in pixels. */
  resize(width: number, height: number): void;
  /**
   * One frame. `dt` in ms (clamped), `elapsed` in seconds; both freeze
   * while paused. Return `false` if nothing was drawn (a texture still
   * loading, say) so the hook does not announce a first frame yet.
   */
  frame(dt: number, elapsed: number): boolean | void;
  /** Free every GL object the scene created. The context itself is the hook's. */
  dispose(): void;
}

export interface GlEnv {
  /** Touch screens: no pointer to follow, and a tighter DPR cap. */
  coarse: boolean;
}

export interface GlSurfaceOptions {
  /** Build the scene. Return null to leave the CSS fallback showing. */
  create: (gl: WebGLRenderingContext, canvas: HTMLCanvasElement, env: GlEnv) => GlScene | null;
  /** Upper bound on devicePixelRatio — `[fine pointer, coarse pointer]`. */
  dprCap?: [number, number];
  /** Internal render scale. Soft imagery upscales invisibly. */
  renderScale?: number;
  /** How close to the viewport the canvas must be before the context is built. */
  near?: string;
  /** How far from the viewport the canvas must be before the context is released. */
  far?: string;
  /** Wait for webfonts before building — for scenes that rasterise text. */
  awaitFonts?: boolean;
  /** Extra run condition on top of visibility, re-read on every `sync()`. */
  shouldRun?: () => boolean;
  /** The first real frame is on the canvas — swap the DOM fallback out here. */
  onFirstFrame?: () => void;
  /** The context was released or lost — put the DOM fallback back here. */
  onRelease?: () => void;
  enabled?: boolean;
}

export interface GlSurfaceControls {
  /** Re-evaluate run/pause — call after whatever `shouldRun` reads has changed. */
  sync(): void;
}

const NOOP_CONTROLS: GlSurfaceControls = { sync() {} };

/**
 * The one WebGL lifecycle every scene on the site shares.
 *
 *  - Built lazily: only once the canvas is within `near` of the viewport,
 *    and then on idle (after fonts, if asked), so it never competes with LCP.
 *  - Runs only while intersecting, the tab is visible and `shouldRun()`
 *    agrees. The clock is the hook's own, so pausing never causes a jump.
 *  - Released with `loseContext()` once the canvas is `far` away, and
 *    brought back with `restoreContext()` when it returns — a canvas can
 *    only ever hold one context, so a lost one is restored, never remade.
 *  - DPR is capped and the drawing buffer rendered below native size.
 *  - Listeners and observers are attached exactly once, outside the
 *    build path, so a restore can never stack a second set.
 *
 * Every failure path leaves the canvas untouched: whatever the caller
 * painted underneath it (the `.hero-fallback` gradient, a `next/image`)
 * stays visible.
 */
export function useGlSurface(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: GlSurfaceOptions
): GlSurfaceControls {
  /* Latest options without re-running the effect: scenes are expensive to
     rebuild, and callers pass fresh closures on every render. */
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  });

  const controlsRef = useRef<GlSurfaceControls>(NOOP_CONTROLS);
  const enabled = options.enabled ?? true;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !enabled || !shouldAnimate()) return;

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const opts = () => optionsRef.current;

    let gl: WebGLRenderingContext | null = null;
    let loseExt: WEBGL_lose_context | null = null;
    let scene: GlScene | null = null;

    let disposed = false;
    let lost = false;
    /* We asked for the loss ourselves (the canvas went far away). */
    let parked = false;
    let near = false;
    let visible = false;
    let pageVisible = !document.hidden;
    let running = false;
    let raf = 0;
    let elapsed = 0;
    let lastFrame = 0;
    let drewFrame = false;
    let idleId: number | undefined;
    let resizeTimer = 0;

    const dpr = () => {
      const [fine, touch] = opts().dprCap ?? [1.75, 1.25];
      return Math.min(window.devicePixelRatio || 1, coarse ? touch : fine);
    };

    const resize = () => {
      if (!gl || !scene || lost || disposed) return;
      const scale = opts().renderScale ?? 0.8;
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr() * scale));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr() * scale));
      if (canvas.width === w && canvas.height === h) return;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      scene.resize(w, h);
    };

    const render = (now: number) => {
      if (disposed || !gl || !scene || !running) return;
      const dt = lastFrame ? Math.min(now - lastFrame, 50) : 16;
      lastFrame = now;
      elapsed += dt;
      const drew = scene.frame(dt, elapsed * 0.001);
      if (!drewFrame && drew !== false) {
        drewFrame = true;
        opts().onFirstFrame?.();
      }
      raf = requestAnimationFrame(render);
    };

    const sync = () => {
      const want =
        !disposed &&
        !!scene &&
        !lost &&
        visible &&
        pageVisible &&
        (opts().shouldRun?.() ?? true);
      if (want && !running) {
        running = true;
        lastFrame = 0;
        raf = requestAnimationFrame(render);
      } else if (!want && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };
    controlsRef.current = { sync };

    const buildScene = () => {
      if (!gl || scene || lost || disposed) return;
      scene = opts().create(gl, canvas, { coarse });
      if (!scene) return; // fallback stays — and we never retry
      /* Force a real resize: the buffer may hold a stale size from before a loss. */
      canvas.width = 0;
      resize();
      sync();
    };

    const acquire = () => {
      if (disposed || gl) return;
      gl = canvas.getContext("webgl", {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: "low-power",
      }) as WebGLRenderingContext | null;
      if (!gl) return;
      loseExt = gl.getExtension("WEBGL_lose_context");
      buildScene();
    };

    /* A lost context invalidates every GL object, so the scene is thrown
       away; `dispose()` still runs so any JS-side resources go with it. */
    const dropScene = () => {
      running = false;
      cancelAnimationFrame(raf);
      scene?.dispose();
      scene = null;
      if (drewFrame) {
        drewFrame = false;
        opts().onRelease?.();
      }
    };

    const park = () => {
      if (!gl || lost || parked) return;
      parked = true;
      dropScene();
      loseExt?.loseContext();
    };

    const unpark = () => {
      if (!gl || !parked) return;
      parked = false;
      if (gl.isContextLost()) loseExt?.restoreContext();
    };

    const onContextLost = (e: Event) => {
      e.preventDefault(); // without this the browser will never restore it
      lost = true;
      dropScene();
    };
    const onContextRestored = () => {
      lost = false;
      buildScene();
    };

    const schedule = () => {
      if (disposed || gl) return;
      const ric =
        window.requestIdleCallback ??
        ((cb: IdleRequestCallback) => window.setTimeout(() => cb({} as IdleDeadline), 200));
      idleId = ric(() => acquire()) as unknown as number;
    };
    const build = () => {
      if (gl) {
        unpark();
        return;
      }
      if (opts().awaitFonts && document.fonts?.status !== "loaded") {
        document.fonts.ready.then(() => {
          if (!disposed && near) schedule();
        });
        return;
      }
      schedule();
    };

    /* Three rings: build when near, run when visible, release when far. */
    const nearObserver = new IntersectionObserver(
      ([entry]) => {
        near = entry.isIntersecting;
        if (near) build();
      },
      { rootMargin: opts().near ?? "100% 0px" }
    );
    const visibleObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0 }
    );
    const farObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) park();
      },
      { rootMargin: opts().far ?? "200% 0px" }
    );
    nearObserver.observe(canvas);
    visibleObserver.observe(canvas);
    farObserver.observe(canvas);

    const resizeObserver = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 150);
    });
    resizeObserver.observe(canvas);

    const onVisibility = () => {
      pageVisible = !document.hidden;
      sync();
    };
    document.addEventListener("visibilitychange", onVisibility);
    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);

    return () => {
      disposed = true;
      controlsRef.current = NOOP_CONTROLS;
      running = false;
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      if (idleId !== undefined) {
        window.cancelIdleCallback?.(idleId);
        window.clearTimeout(idleId);
      }
      nearObserver.disconnect();
      visibleObserver.disconnect();
      farObserver.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      scene?.dispose();
      scene = null;
      if (gl && !gl.isContextLost()) loseExt?.loseContext();
      gl = null;
    };
  }, [canvasRef, enabled]);

  /* Stable identity: callers can keep it in a closure for the page's life.
     The indirection means it works before the context exists and after
     the effect has been torn down and set up again. */
  const [stable] = useState<GlSurfaceControls>(() => ({
    sync: () => controlsRef.current.sync(),
  }));
  return stable;
}
