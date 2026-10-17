import type { ReactNode } from "react";

/**
 * A line of display type that runs across the page between the hero and
 * the work — the beat that says the curtain has risen. Pure CSS motion
 * (`.ticker-track` in globals.css); under reduced motion it simply sits
 * still, and the row is `aria-hidden` because every word on it appears
 * elsewhere in real copy.
 */
const ITEMS: ReactNode[] = [
  "Full-stack developer",
  <>
    AI <span className="serif-accent">engineer</span>
  </>,
  "Next.js",
  "WebGL",
  "Chennai, IN",
  <>
    Open to <span className="serif-accent">work</span>
  </>,
];

export function Ticker() {
  /* Two copies make the loop seamless; the track scrolls exactly half. */
  const run = [...ITEMS, ...ITEMS];
  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden border-y border-[var(--line-1)] bg-[var(--bg-0)] py-6 md:py-8"
    >
      <div className="ticker-track flex w-max items-center whitespace-nowrap">
        {run.map((item, i) => (
          <span key={i} className="display-md flex items-center font-medium">
            <span className="px-8 md:px-12">{item}</span>
            <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
          </span>
        ))}
      </div>
    </div>
  );
}
