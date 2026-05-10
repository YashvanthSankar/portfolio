"use client";

import { useEffect, useRef } from "react";
import { shouldAnimate } from "@/lib/utils";

export function useMagnetic<T extends HTMLElement>(strength = 0.25, max = 8) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!shouldAnimate()) return;
    if (window.matchMedia("(hover: none)").matches) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;
      const clamp = (v: number) => Math.max(-max, Math.min(max, v));
      el.style.setProperty("--mx", `${clamp(dx)}px`);
      el.style.setProperty("--my", `${clamp(dy)}px`);
    };
    const onLeave = () => {
      el.style.setProperty("--mx", "0px");
      el.style.setProperty("--my", "0px");
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength, max]);

  return ref;
}
