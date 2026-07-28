"use client";

import { useEffect, useLayoutEffect } from "react";

/**
 * `useLayoutEffect` on the client, `useEffect` on the server.
 *
 * Used where SSR has to emit the *resting* markup — so hydration matches
 * and a JS-less visit still reads correctly — while the client needs to
 * swap in the pre-animation state before the browser paints, so the
 * finished state never flashes first.
 */
export const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
