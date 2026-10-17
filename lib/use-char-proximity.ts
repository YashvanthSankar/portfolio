"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "@/lib/gsap";
import { shouldAnimate } from "@/lib/utils";

interface Options {
  /** The per-character elements inside `scopeRef`. */
  selector: string;
  /** Pointer distance (px) within which a character reacts. */
  radius?: number;
  /** How far (px) the nearest character rises. */
  lift?: number;
  /** Degrees of lean, away from the pointer. */
  skew?: number;
  /** Scale at zero distance. */
  scale?: number;
}

/**
 * Display type that leans away from the pointer: each character within
 * `radius` rises, skews away and grows a touch, falling off with the
 * square of the distance so only a few letters move at once. Shared by
 * the hero headline and the footer wordmark, so the page ends the way it
 * began.
 *
 * Transforms only — Geist ships here as static instances, so there is no
 * weight axis to push. Pointer devices only; a no-op on touch and under
 * reduced motion. Every character is driven by its own `quickTo`, which
 * is what keeps the response smooth at pointer-event rates.
 */
export function useCharProximity(
  scopeRef: RefObject<HTMLElement | null>,
  { selector, radius = 140, lift = 10, skew = 7, scale = 1.05 }: Options
) {
  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope || !shouldAnimate()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const chars = Array.from(scope.querySelectorAll<HTMLElement>(selector));
    if (chars.length === 0) return;

    const ease = { duration: 0.45, ease: "power3.out" };
    /* `scale` is a shorthand GSAP expands to scaleX/scaleY, and `quickTo`
       can only reset a property it actually tweens — ask for the two axes. */
    const setters = chars.map((el) => ({
      y: gsap.quickTo(el, "y", ease),
      skew: gsap.quickTo(el, "skewX", ease),
      scaleX: gsap.quickTo(el, "scaleX", ease),
      scaleY: gsap.quickTo(el, "scaleY", ease),
    }));

    let raf = 0;
    let px = -1e4;
    let py = -1e4;
    /* Whether any character is currently displaced — the only time a
       scroll (which moves the letters under a still pointer) matters. */
    let active = false;

    const apply = () => {
      raf = 0;

      /* Skip the per-character work when the pointer is nowhere near. */
      const box = scope.getBoundingClientRect();
      const nearScope =
        px > box.left - radius &&
        px < box.right + radius &&
        py > box.top - radius &&
        py < box.bottom + radius;
      if (!nearScope && !active) return;

      let any = false;
      chars.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const dx = px - (r.left + r.width / 2);
        const dy = py - (r.top + r.height / 2);
        const dist = Math.hypot(dx, dy);
        const s = dist < radius ? (1 - dist / radius) ** 2 : 0;
        if (s > 0) any = true;
        setters[i].y(-lift * s);
        /* Pointer to the left → lean right, and vice versa. */
        setters[i].skew(skew * s * (dx < 0 ? 1 : -1));
        setters[i].scaleX(1 + (scale - 1) * s);
        setters[i].scaleY(1 + (scale - 1) * s);
      });
      active = any;
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      schedule();
    };
    const onLeave = () => {
      px = -1e4;
      py = -1e4;
      schedule();
    };
    const onScroll = () => {
      if (active) schedule();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(chars, "y,skewX,scaleX,scaleY");
      gsap.set(chars, { y: 0, skewX: 0, scaleX: 1, scaleY: 1 });
    };
  }, [scopeRef, selector, radius, lift, skew, scale]);
}
