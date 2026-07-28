"use client";

import { useEffect, useState } from "react";
import { sections } from "@/data/sections";
import { throttle } from "@/lib/utils";

interface Options {
  /** Skip the work entirely — used by the navbar on non-scroll-spy pages. */
  enabled?: boolean;
  /** `past` flips true once the reader is this far down. */
  revealAfter?: number;
  throttleMs?: number;
}

/**
 * Shared scroll-spy.
 *
 * A probe sits a third of the way down the viewport, and the active
 * chapter is the *last* one whose top edge has crossed it. `sections` is
 * in document order, so a single pass settles it — no distance ties, no
 * gaps between sticky panels where nothing matches.
 *
 * The hero is excluded from that pass on purpose. It is `sticky top-0`,
 * so once stuck its rect is permanently (0, viewportHeight): any test of
 * the form "does this section straddle the probe" matches the hero at
 * every scroll position, and an indicator built on one never leaves
 * "Intro". Instead the hero is the fallback — it is where the reader is
 * precisely when no later section has reached the probe yet.
 *
 * One implementation, three consumers: the navbar, the desktop index and
 * the mobile cluster physically cannot disagree about where the reader is.
 */
export function useActiveSection({
  enabled = true,
  revealAfter = 0,
  throttleMs = 100,
}: Options = {}) {
  const [active, setActive] = useState(sections[0].id);
  const [past, setPast] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let disposed = false;

    const measure = throttle(() => {
      setPast(window.scrollY >= revealAfter);

      const probe = window.innerHeight * 0.33;
      const [hero, ...rest] = sections;
      let current = hero.id;

      for (const s of rest) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        /* Everything below the fold arrives as its own chunk, and between
           mounting and laying out a section measures `top: 0, height: 0`.
           Taken at face value that reads as "the reader is at the bottom
           of the page", so the last such section wins and the indicator
           flashes "Contact" on load. A section that has laid out always
           has height; one that hasn't simply has not been reached yet. */
        if (rect.height === 0) continue;
        if (rect.top <= probe) current = s.id;
      }

      setActive(current);
    }, throttleMs);

    measure();
    window.addEventListener("scroll", measure, { passive: true });

    /* Scroll alone is not enough to keep this honest. Everything below the
       fold arrives as its own chunk and webfonts swap in after first paint,
       and both move every section's offset. Measured at mount — before any
       of that has laid out — every section still reports `top: 0`, so the
       last one wins and the indicator latches onto "Contact" until the
       reader happens to scroll. Watching the document box re-measures on
       each of those settling steps. */
    const observer = new ResizeObserver(() => measure());
    observer.observe(document.documentElement);
    document.fonts?.ready.then(() => {
      if (!disposed) measure();
    });

    return () => {
      disposed = true;
      measure.cancel();
      observer.disconnect();
      window.removeEventListener("scroll", measure);
    };
  }, [enabled, revealAfter, throttleMs]);

  return { active, past };
}
