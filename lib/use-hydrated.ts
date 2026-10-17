"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * `false` on the server and during hydration, `true` afterwards. For
 * decoration that is not worth shipping in the HTML — the server renders
 * the no-op branch, the client agrees on first paint, then fills it in.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
