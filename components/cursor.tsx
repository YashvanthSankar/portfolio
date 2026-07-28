"use client";

import { useEffect, useRef } from "react";
import { shouldAnimate } from "@/lib/utils";

const INTERACTIVE = 'a, button, input, textarea, select, [data-cursor="hover"]';

/**
 * Desktop-only custom cursor: a hard accent dot that tracks 1:1 and a
 * ring that lags behind it, expanding over interactive targets. Never
 * mounts on touch devices or under reduced motion — the native cursor is
 * only hidden once this is actually running.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!shouldAnimate()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const root = document.documentElement;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let ringX = targetX;
    let ringY = targetY;
    let visible = false;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!visible) {
        visible = true;
        ringX = targetX;
        ringY = targetY;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
        /* Only now is there something to replace the native cursor with.
           Hiding it on mount instead leaves the pointer invisible for as
           long as the reader doesn't move the mouse. */
        root.classList.add("custom-cursor");
      }
      dot.style.transform = `translate3d(${targetX - 3}px, ${targetY - 3}px, 0)`;
      ring.dataset.hover = (e.target as Element | null)?.closest?.(INTERACTIVE)
        ? "true"
        : "false";
    };

    const onLeave = () => {
      visible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const loop = () => {
      ringX += (targetX - ringX) * 0.16;
      ringY += (targetY - ringY) * 0.16;
      const size = ring.dataset.hover === "true" ? 26 : 17;
      ring.style.transform = `translate3d(${ringX - size}px, ${ringY - size}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      root.classList.remove("custom-cursor");
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" style={{ opacity: 0 }} aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" style={{ opacity: 0 }} aria-hidden="true" />
    </>
  );
}
