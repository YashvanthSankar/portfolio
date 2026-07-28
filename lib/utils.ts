import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shouldAnimate() {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
}

interface Throttled<Args extends unknown[]> {
  (...args: Args): void;
  /** Drop any pending trailing call and clear the timer. */
  cancel(): void;
}

/**
 * Leading *and* trailing edge throttle.
 *
 * The trailing call is what makes this usable for scroll-spying: a
 * leading-only throttle discards the final event of a scroll gesture, so
 * the reader stops mid-section and the indicator stays stuck on whichever
 * position happened to survive the last window.
 */
export function throttle<Args extends unknown[]>(
  fn: (...args: Args) => void,
  limit: number
): Throttled<Args> {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let pending: Args | null = null;

  const invoke = (args: Args) => {
    fn(...args);
    timer = setTimeout(() => {
      timer = null;
      if (!pending) return;
      const next = pending;
      pending = null;
      invoke(next);
    }, limit);
  };

  const throttled = ((...args: Args) => {
    if (timer) {
      pending = args;
      return;
    }
    invoke(args);
  }) as Throttled<Args>;

  throttled.cancel = () => {
    if (timer) clearTimeout(timer);
    timer = null;
    pending = null;
  };

  return throttled;
}
