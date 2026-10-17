"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "@/lib/gsap";
import { shouldAnimate } from "@/lib/utils";

interface Options {
  /** The elements inside `scopeRef` that move. */
  selector: string;
  /** Pointer distance (px) within which an element is pushed. */
  radius?: number;
  /** Push (px) at zero distance. */
  strength?: number;
  /** Spring constant toward the pushed position. */
  stiffness?: number;
  /** Velocity kept per frame; lower settles faster. */
  damping?: number;
}

/**
 * Elements that get out of the pointer's way and spring back: each one
 * is pushed along the line from the pointer, falling off with the square
 * of the distance, and a damped spring carries it there and home again.
 *
 * Transforms go through GSAP's `quickSetter`, so they merge with whatever
 * reveal tween already owns the element's transform instead of fighting
 * it. The loop runs only while something is displaced or the pointer is
 * near the scope, and stops on its own once everything has settled.
 * Pointer devices only; a no-op on touch and under reduced motion.
 */
export function useRepel(
  scopeRef: RefObject<HTMLElement | null>,
  { selector, radius = 120, strength = 26, stiffness = 0.09, damping = 0.78 }: Options
) {
  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope || !shouldAnimate()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const els = Array.from(scope.querySelectorAll<HTMLElement>(selector));
    if (els.length === 0) return;

    const items = els.map((el) => ({
      el,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      setX: gsap.quickSetter(el, "x", "px") as (v: number) => void,
      setY: gsap.quickSetter(el, "y", "px") as (v: number) => void,
    }));

    let px = -1e4;
    let py = -1e4;
    let raf = 0;

    const step = () => {
      raf = 0;
      const box = scope.getBoundingClientRect();
      const near =
        px > box.left - radius &&
        px < box.right + radius &&
        py > box.top - radius &&
        py < box.bottom + radius;

      let moving = false;
      for (const it of items) {
        /* The rect includes the current offset; subtract it to get home. */
        const r = it.el.getBoundingClientRect();
        const cx = r.left + r.width / 2 - it.x;
        const cy = r.top + r.height / 2 - it.y;
        let tx = 0;
        let ty = 0;
        if (near) {
          const dx = cx - px;
          const dy = cy - py;
          const dist = Math.hypot(dx, dy);
          if (dist < radius && dist > 0.001) {
            const s = (1 - dist / radius) ** 2 * strength;
            tx = (dx / dist) * s;
            ty = (dy / dist) * s;
          }
        }
        it.vx = (it.vx + (tx - it.x) * stiffness) * damping;
        it.vy = (it.vy + (ty - it.y) * stiffness) * damping;
        it.x += it.vx;
        it.y += it.vy;
        if (Math.abs(it.x) + Math.abs(it.y) + Math.abs(it.vx) + Math.abs(it.vy) > 0.05) {
          moving = true;
        } else {
          it.x = it.y = it.vx = it.vy = 0;
        }
        it.setX(it.x);
        it.setY(it.y);
      }

      if (moving || near) raf = requestAnimationFrame(step);
    };

    const wake = () => {
      if (!raf) raf = requestAnimationFrame(step);
    };
    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      wake();
    };
    const onLeave = () => {
      px = -1e4;
      py = -1e4;
      wake();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", wake, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", wake);
      document.removeEventListener("pointerleave", onLeave);
      gsap.set(els, { x: 0, y: 0 });
    };
  }, [scopeRef, selector, radius, strength, stiffness, damping]);
}
