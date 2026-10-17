"use client";

import { useEffect, useRef, type RefObject } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { shouldAnimate } from "@/lib/utils";
import { useGlSurface } from "@/lib/gl/use-gl-surface";
import { createHeroScene } from "@/components/gl/hero-scene";

/**
 * Signature WebGL hero background. Raw GL — no three.js: two programs,
 * one triangle, the wordmark carried as a texture that the noise field
 * warps and the cursor shreds, and a small simulated trail behind the
 * pointer. The scene itself lives in hero-scene.ts; this component wires
 * it to the shared lifecycle and to the page's scroll.
 *
 * Built on idle, after fonts (the headline is LCP and the wordmark
 * texture must be set in Geist), paused when the tab is hidden, and —
 * because a sticky hero is "visible" at every scroll position — paused
 * by hand once the page curtain has fully covered it. It never covers
 * the CSS `.hero-fallback` gradient if anything fails.
 */
export function HeroCanvas({ sectionRef }: { sectionRef: RefObject<HTMLElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  /* 0 → hero in view, 1 → the next section has slid fully over it. */
  const calm = useRef(0);

  const controls = useGlSurface(canvasRef, {
    awaitFonts: true,
    renderScale: 0.8,
    shouldRun: () => calm.current < 1,
    create: (gl, canvas, { coarse }) =>
      createHeroScene(gl, canvas, coarse, () => calm.current),
    /* Fade in only once there's something real on the canvas. */
    onFirstFrame: () => {
      if (canvasRef.current) canvasRef.current.style.opacity = "1";
    },
    onRelease: () => {
      if (canvasRef.current) canvasRef.current.style.opacity = "0";
    },
  });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !shouldAnimate()) return;
    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom top",
      onUpdate(self) {
        const wasCovered = calm.current >= 1;
        calm.current = self.progress;
        if (wasCovered !== self.progress >= 1) controls.sync();
      },
    });
    return () => st.kill();
  }, [sectionRef, controls]);

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
