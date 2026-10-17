/**
 * Motion tokens — the TypeScript mirror of the `--ease-*` and `--dur-*`
 * custom properties in app/globals.css. CSS transitions read the
 * properties; GSAP reads these. Change both or neither.
 */

export const EASE = {
  /** `--ease-out`: cubic-bezier(0.16, 1, 0.3, 1) — the expo-out curve. */
  out: "expo.out",
  /** `--ease-io`: cubic-bezier(0.83, 0, 0.17, 1) — quint in-out. */
  io: "power4.inOut",
  none: "none",
} as const;

/** Seconds. `--dur-fast` / `--dur-base` / `--dur-slow`, plus the reveal length. */
export const DUR = {
  fast: 0.2,
  base: 0.5,
  slow: 0.9,
  reveal: 0.8,
} as const;

/** Per-element stagger ladder: chips, rows, cards. */
export const STAGGER = {
  tight: 0.03,
  base: 0.07,
  loose: 0.09,
} as const;

/** Where a section's reveal fires relative to the viewport. */
export const REVEAL_START = "top 82%";

/** ScrollTrigger scrub lag. Tight follows the wheel; soft trails it. */
export const SCRUB = {
  tight: 0.4,
  soft: 0.6,
} as const;

/**
 * The gate every pin, scrub and parallax lives behind. Mobile and reduced
 * motion get plain reveals — see CLAUDE.md, "Motion architecture".
 */
export const DESKTOP_MOTION =
  "(min-width: 768px) and (prefers-reduced-motion: no-preference)";
