import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { shouldAnimate } from "@/lib/utils";

interface RevealOptions {
  /** Split granularity. Lines read best for prose, chars for display type. */
  type?: "lines" | "words" | "chars";
  /** Delay before the first element animates. */
  delay?: number;
  /** Per-element stagger. */
  stagger?: number;
  duration?: number;
  /** Animate on scroll instead of immediately. */
  scroll?: boolean;
  /** ScrollTrigger start position when `scroll` is set. */
  start?: string;
}

type Cleanup = () => void;

const NOOP: Cleanup = () => {};

/**
 * Masked split-text reveal: each line/word/char rises out from behind a
 * clipped wrapper. Returns a cleanup that reverts the split and kills the
 * tween.
 *
 * Rules this enforces so the page never breaks:
 *  - No-op (content stays visible) under reduced motion.
 *  - Hidden state is set from JS, never CSS — failed JS still shows text.
 *  - Re-splits once webfonts land, because line breaks measured against
 *    the fallback font are wrong.
 */
export function splitReveal(
  target: HTMLElement | null,
  {
    type = "lines",
    delay = 0,
    stagger = 0.08,
    duration = 0.9,
    scroll = true,
    start = "top 82%",
  }: RevealOptions = {}
): Cleanup {
  if (!target || !shouldAnimate()) return NOOP;

  let split: SplitText | null = null;
  let tween: gsap.core.Tween | null = null;
  let trigger: ScrollTrigger | null = null;
  let disposed = false;
  let settled = false;
  const prevCss = target.style.cssText;

  /**
   * Tear the split down once the reveal is over. The mask wrappers exist
   * only to clip lines while they travel; leaving them in place means the
   * resting headline is permanently inside an `overflow: clip` box, which
   * shears descenders (the tails of "y" and "g") on large serif italics.
   * After this runs the heading is plain text again — nothing can clip it.
   */
  const settle = () => {
    if (disposed || settled) return;
    settled = true;
    split?.revert();
    split = null;
    target.style.cssText = prevCss;
  };

  const build = () => {
    if (disposed || settled) return;

    split?.revert();
    tween?.kill();
    trigger?.kill();
    target.style.cssText = prevCss;

    /* Deliberately NO `mask` option.
     *
     * A masked reveal needs an `overflow: clip` wrapper around every line,
     * and that wrapper outlives the animation. Any glyph painting below
     * its line box — the swash tails of "y" and "g" in a large serif
     * italic — then gets sheared off permanently. Sizing the clip window
     * to fit is guesswork against every glyph in every font, and it fails
     * outright if the animation is interrupted and never tears the
     * wrapper down.
     *
     * A rise paired with a fade reads nearly identically and introduces
     * no clipping box at all, so descenders cannot be cut in any state —
     * mid-animation, on completion, or if JS dies halfway through. */
    split = new SplitText(target, {
      type: type === "chars" ? "chars,words" : type,
      linesClass: "split-line",
      // Screen readers get the original string, not a pile of spans.
      aria: "auto",
    });

    const targets = split[type];
    if (!targets?.length) return;

    gsap.set(targets, { yPercent: 34, autoAlpha: 0 });

    const vars: gsap.TweenVars = {
      yPercent: 0,
      autoAlpha: 1,
      duration,
      delay,
      stagger,
      ease: "expo.out",
      onComplete: settle,
    };

    if (scroll) {
      vars.scrollTrigger = { trigger: target, start, once: true };
    }

    tween = gsap.to(targets, vars);
    trigger = (tween.scrollTrigger as ScrollTrigger) ?? null;
  };

  build();

  /* Re-split after webfonts swap so line breaks match final metrics. */
  let rebuilt = false;
  document.fonts?.ready.then(() => {
    if (disposed || rebuilt || settled) return;
    rebuilt = true;
    build();
    ScrollTrigger.refresh();
  });

  return () => {
    disposed = true;
    trigger?.kill();
    tween?.kill();
    split?.revert();
    target.style.cssText = prevCss;
  };
}

/**
 * Resolve a selector inside `scope` rather than the whole document.
 *
 * This matters for correctness, not just tidiness: sections below the
 * fold hydrate later (they arrive via next/dynamic), so a document-wide
 * selector lets an early section mutate a not-yet-hydrated section's
 * DOM — which React then reports as a hydration mismatch.
 */
export function scoped(
  selector: string,
  scope: Element | null | undefined
): HTMLElement[] {
  const root: ParentNode = scope ?? document;
  return Array.from(root.querySelectorAll<HTMLElement>(selector));
}

/**
 * Plain fade-and-rise for elements that don't need text splitting —
 * cards, rows, chips. Same reduced-motion contract as `splitReveal`.
 *
 * A string target is resolved within `trigger`, so each instance of a
 * repeated component only ever animates its own elements.
 */
export function fadeUp(
  targets: string | gsap.TweenTarget | null,
  {
    delay = 0,
    stagger = 0.07,
    duration = 0.8,
    y = 24,
    trigger,
    start = "top 88%",
  }: {
    delay?: number;
    stagger?: number;
    duration?: number;
    y?: number;
    trigger?: Element | null;
    start?: string;
  } = {}
): Cleanup {
  if (!targets || !shouldAnimate()) return NOOP;

  const resolved =
    typeof targets === "string" ? scoped(targets, trigger) : targets;
  if (Array.isArray(resolved) && resolved.length === 0) return NOOP;

  const tween = gsap.fromTo(
    resolved,
    { autoAlpha: 0, y },
    {
      autoAlpha: 1,
      y: 0,
      duration,
      delay,
      stagger,
      ease: "expo.out",
      scrollTrigger: trigger ? { trigger, start, once: true } : undefined,
    }
  );

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
  };
}
