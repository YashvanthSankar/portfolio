"use client";

import { useSyncExternalStore } from "react";

/**
 * `matchMedia` as a subscription. The server snapshot is `false`, so
 * markup that depends on it renders the no-match branch on the server
 * and on the first client paint alike — no hydration mismatch, and no
 * `setState` inside an effect to get there.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}
