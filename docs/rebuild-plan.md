# Rebuild plan (Phase 0 output)

Companion to `rebuild-prompt.md`. Measured on `main` at 7b24c83.

## Baseline

| | Measured |
|---|---|
| `/` first-load JS (gzip) | 264 KB: React-DOM + Next ≈ 130, GSAP + ScrollTrigger + SplitText ≈ 54, hero + shader 13.5, app / Lenis / Lucide / analytics ≈ 66 |
| `/work` first-load JS | 247 KB |
| `/` HTML | 186 KB: 96 KB is 86 inline SVGs (socials rendered 4×, 36 stack chips SSR'd), 59 KB path data |
| Fonts | Geist as static per-weight instances, no variable `wght` axis |

## Budget revision

The brief's 170 KB is below the framework floor, so it is replaced with:
`/` first-load ≤ **250 KB** gzip (must end *below* baseline), every new GL
scene in a lazy chunk initialised on idle, `/` HTML ≤ **120 KB**. All other
numbers in §2 of the brief stand (LCP < 2.0 s, CLS < 0.03, INP < 150 ms,
Lighthouse ≥ 90 / 100 / 100 / 100).

## Library decision: raw WebGL, 0 KB of new dependencies

- The hero is already raw GL. The fluid trail needs only an RGBA8 ping-pong
  framebuffer pair, which every WebGL 1 context supports without extensions.
- Covers and portrait are each "one quad, one fragment program".
- A shared `lib/gl/` module (compile/link, FBO pair, lifecycle: idle init,
  DPR cap, visibility pause, context loss, release) is ~200 lines written once.
- `ogl` would add ≈ 9 KB for abstractions we'd use a fifth of; `three` ≈ 150 KB.

## Context strategy (a deliberate deviation from the brief)

§3.3.2 asked for one shared canvas over the project covers. The Work panels
are sticky siblings with ascending z-index: panel 2 slides *over* panel 1, so
no single canvas can sit between panel 1's image and panel 2's background.
Instead: **one canvas per GL surface, governed by a lifecycle registry**:
created when within one viewport, rendering only while intersecting,
released with `loseContext()` two viewports away. The hero gains a pause
once the curtain fully covers it (today it never pauses: sticky means
always intersecting). Net effect: ≤ 2 live contexts at any scroll position.

## Motion system

`lib/motion.ts` mirrors the CSS tokens (eases, durations) and holds the
timing score: hero starts at 0.15 s, chars 1.1 s `expo.out`, section
reveals at `top 82%`, stagger ladder 0.03 / 0.07 / 0.09, scrubs 0.4–0.6.
Pins and scrubs stay inside the matchMedia gate; reduced motion renders
static frames with every piece of content visible.

## Signature moments

1. **Hero.** Disturbance field: 192×108 RGBA8 ping-pong; each frame splats
   pointer velocity, advects along the flow, decays ×0.975; the main pass
   reads it to bend the warp, so trails are carried away by the current.
   Dispersion: ridge sampled at f−δ / f / f+δ tinted R/G/B at a low mix.
   `u_calm` from curtain progress slows time and dims lime; at 100 % the
   loop pauses. Headline: proximity push (y / skew / scale within ~140 px
   via `quickTo`). Wordmark relief and its placement rules unchanged.
2. **Work.** Per-cover canvas. Texture = a 2D-canvas render of the
   generative art (trace maths extracted to `lib/cover-art.ts`, shared with
   the SVG) or the screenshot when one exists. Hover: radial displacement
   that follows the cursor and decays. Scroll: Lenis velocity → RGB split
   and slight bend. Text plates stay in the DOM above. Progress rail
   `01 / 03` scrubbed with the stack. Mobile: reveal cards, no GL.
3. **About.** Portrait dither shader (Bayer 8×8, two-tone bg-0 / text-1,
   lime on the threshold edge). `u_resolve` 0→1 over 1.6 s on enter; hover
   re-dithers in a wave from the cursor, then resolves. `next/image` stays
   underneath and is hidden only after the first GL frame.
4. **Stack, option (a).** The real list is the picture: chips repel from
   the cursor on a spring (transforms only, 36 elements), icon turns lime,
   label scrambles on hover, headings get a mono index. Chosen over (b)
   because it needs no duplicate DOM and no third canvas.
5. **Footer.** Wordmark letters share the hero's proximity-push helper; the
   scrub rise stays.
6. **Cursor.** `data-cursor="view|copy|drag"` labels inside the ring; the
   ring morphs to a button's bounds over `.btn`. Off on touch, reduced
   motion and `/lilmoney`.
7. **Transitions.** GSAP clip-path wipe provider, ≤ 350 ms, `/` ↔ `/work`.
   The View Transitions API is still `unstable_` in React 19.2 / Next 16,
   so it is not used. Skipped under reduced motion.
8. **Micro.** Nav scramble, hairline sweep on form focus, lime line-burst
   on send; copy feedback and the Chennai clock stay.
9. **`/work`.** Index rows, cursor-following preview card, language filter
   chips, count, ↑ / ↓ / Enter.
10. **Sound.** Synthesised Web Audio ticks (no files, ≈ 2 KB), off by
    default. Pending decision.

## HTML diet (Phase 1)

Social icons as one `<symbol>` sprite; cover path coordinates rounded to
integers; keep the 36 stack chips server-rendered (they are content).

## Fixes carried (brief §5)

All six: context-restore leak, derived section numbers, `HERO_ID`,
`data/site.ts` constants in `layout.tsx`, flag stale `now.tsx`, `CLAUDE.md`.

## Risks

- Fluid pass on weak GPUs → tiny field, skipped on coarse pointers.
- Cover textures at 55 vw → rendered at 0.75 scale.
- Budget: GSAP cannot be cut; SplitText can go lazy if needed (−10 KB).
- Fast-refresh stacking → every hook returns a full cleanup.

## Phases

As in the brief, on branch `redesign/cinematic`, lint + build + checkpoint
after each. Phase 6 measures Lighthouse before (main, via worktree) and after.
