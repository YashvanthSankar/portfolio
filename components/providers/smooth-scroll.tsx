"use client";

import Lenis from "lenis";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { shouldAnimate } from "@/lib/utils";

type ScrollTarget = string | number | HTMLElement;

interface ScrollToOptions {
  offset?: number;
  immediate?: boolean;
  updateHash?: boolean;
}

const ScrollContext = createContext<{
  scrollTo: (target: ScrollTarget, opts?: ScrollToOptions) => void;
}>({ scrollTo: () => {} });

/** Height of the fixed navbar — anchors stop just below it. */
const NAV_OFFSET = -84;

/**
 * Owns the Lenis instance and drives it from GSAP's ticker so smooth
 * scroll and ScrollTrigger share one clock. Skipped entirely under
 * reduced-motion — the page then uses plain native scrolling.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!shouldAnimate()) return;

    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      // We handle anchors ourselves so nav/keyboard jumps share one path.
      anchors: false,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    // Mandatory: without this a long frame makes GSAP "smooth" the clock
    // and Lenis visibly rubber-bands.
    gsap.ticker.lagSmoothing(0);

    // Line-splits and layout measured pre-webfont are wrong.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    // Deep link on load — jump without animating past the whole page.
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
      requestAnimationFrame(() => {
        const el = document.querySelector(hash);
        if (el) lenis.scrollTo(el as HTMLElement, { offset: NAV_OFFSET, immediate: true });
      });
    }

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollTo = useCallback((target: ScrollTarget, opts: ScrollToOptions = {}) => {
    const { offset = NAV_OFFSET, immediate = false, updateHash = true } = opts;
    const lenis = lenisRef.current;

    if (typeof target === "string" && updateHash && target.startsWith("#")) {
      window.history.replaceState(null, "", target);
    }

    if (lenis) {
      lenis.scrollTo(target, {
        offset: typeof target === "number" ? 0 : offset,
        duration: immediate ? 0 : 1.15,
        immediate,
      });
      return;
    }

    /* No Lenis (reduced motion / not mounted) — native fallback. */
    if (typeof target === "number") {
      window.scrollTo({ top: target, behavior: "auto" });
      return;
    }
    const el =
      typeof target === "string" ? document.querySelector(target) : target;
    el?.scrollIntoView({ behavior: "auto", block: "start" });
  }, []);

  return (
    <ScrollContext.Provider value={{ scrollTo }}>{children}</ScrollContext.Provider>
  );
}

/** Smooth-scrolls to a selector (`"#projects"`), element, or offset. */
export function useScrollTo() {
  return useContext(ScrollContext).scrollTo;
}
