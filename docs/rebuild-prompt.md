# Build brief: yashvanth.com, the award-level rebuild

> Paste this whole file into Claude Code running **Fable 5.1**
> (`/model claude-fable-5-1`), started in the repo root. Or tell it:
> "Read `docs/rebuild-prompt.md` and carry it out."

---

## 0. Who you are and what you're making

You are a senior creative developer. You've shipped sites that won
Awwwards Site of the Day and FWA, and you have a strict performance
engineer's habits. You are rebuilding the front end of **yashvanth.com**,
the personal portfolio of Yashvanth Sankar, a full-stack developer and
AI engineer based in Chennai.

**Bar for quality:** the cinematic, prompt-built sites showcased on
getlayers.ai (shader backgrounds, fluid/iridescent 3D, depth, live
gradients, text animation, custom cursors), at the level of craft found on
Awwwards SOTD winners. The site must feel *made by a person with taste*,
not generated. Every effect earns its place, and nothing is decorative
noise.

**One sentence to steer every decision:** *"A quiet, precise engineer who
makes the web feel alive."* Restraint first, then spectacle where it matters.

This repo already exists and works. **Evolve it, don't start over.**
Read `CLAUDE.md` and the whole codebase before writing any code. The
existing architecture (Lenis owns scroll, GSAP owns motion, data in
`data/`, sections registry, reveal helpers, CSP) is sound. Build on it.

---

## 1. Hard constraints (do not break)

1. **Stack stays:** Next.js 16 App Router, React 19, TypeScript strict,
   Tailwind v4 (CSS-first, tokens in `app/globals.css`), GSAP +
   ScrollTrigger + SplitText, Lenis. `npm run build` and `npm run lint`
   must pass after every phase. There is no test suite; those two commands
   are the gate.
2. **Content is sourced from `data/`.** Never hard-code copy that already
   lives in `data/*.ts`. `data/sections.ts` stays the single source of
   truth for navigation, shortcuts, indicators and the footer sitemap.
   That includes section *numbers*: derive them from the registry, don't
   type `"01"` by hand.
3. **Leave `/lilmoney` alone.** It is a separate product site with its own
   design system. Don't restyle it, don't let portfolio globals (cursor,
   grain, Lenis, fonts) leak into it, and don't touch
   `data/littlemoney-legal.ts`, `app/lilmoney/**`, the `/downloads` headers,
   or the LilMoney rewrites and redirects.
4. **Security:** keep every header and the CSP in `next.config.ts`. If you
   add an origin (CDN, font, model file), add it to the CSP as narrowly as
   possible. Prefer self-hosting assets in `public/` so the CSP doesn't
   need to grow.
5. **`/api/contact` behaviour stays the same:** Zod validation, rate limit,
   honeypot, Resend constructed inside the handler. You may restyle the
   form, but not weaken it.
6. **Progressive enhancement:** with JavaScript disabled or WebGL broken,
   the page must still be complete, readable and good-looking. Hidden
   state comes from JS, never CSS (see the `fadeUp` / `splitReveal`
   contract in `CLAUDE.md`).
7. **Reduced motion means "skip the tween, not the content."** Under
   `prefers-reduced-motion: reduce` there are no scrubs, pins, parallax,
   smooth scroll or shader animation. Show static frames instead, and keep
   every piece of content visible.

---

## 2. Performance budget (non-negotiable, measure it)

| Metric (mobile, Moto G Power / 4G throttling in Lighthouse) | Budget |
|---|---|
| LCP | < 2.0 s (hero headline is LCP, text, never a canvas) |
| CLS | < 0.03 |
| INP | < 150 ms |
| TBT | < 200 ms |
| Initial JS (route `/`, gzipped) | < 170 KB, excluding lazily loaded 3D chunks |
| Lighthouse Performance / A11y / Best Practices / SEO | ≥ 90 / 100 / 100 / 100 |

Rules:
- All WebGL/3D initialises in `requestIdleCallback` *after* first paint,
  in its own dynamically imported chunk. The canvas fades in over a CSS
  fallback that is always painted underneath.
- Cap DPR (≤ 1.75 desktop, ≤ 1.25 touch), render below native resolution
  where the image is soft, pause rAF when offscreen or the tab is hidden,
  handle `webglcontextlost`/`restored` **without leaking observers or
  listeners**, and call `loseContext()` on unmount.
- At most **one** live WebGL context on screen at a time. If you add a
  second scene, either share the renderer or tear down the first.
- Fonts: `next/font` only, `display: swap`, subset, and preload only the
  display weight the hero uses.
- Images: `next/image`, AVIF/WebP, explicit sizes. No layout shift when
  a dynamic chunk mounts (skeletons match final heights).
- Run `npm run build` and report the route sizes. If you break the
  budget, fix it before moving on.

---

## 3. Design direction

### 3.1 Keep the identity, raise the craft
- **Dark-only canvas,** near-black `--bg-0 #0A0A0B`. **One accent:** electric
  lime `#C8F04B`, used to mark state, the single primary CTA in a view, and
  light inside the 3D scenes. Never as a flat fill across large areas.
- **Type:** Geist Sans for display and body, Geist Mono for metadata only,
  Instrument Serif italic for emphasis, **2–4 words per section, never more**.
  Display sizes are large and tight (-0.045em) with fluid `clamp()`.
- **Hairlines, not boxes.** 1px `--line-1`. Radii ≤ 2px. No drop shadows
  except the accent glow.
- **Film grain** overlay stays. It unifies the frame.

### 3.2 What "doesn't look AI-made" means here (avoid all of these)
- No purple-to-blue gradients, glassmorphism cards, emoji, generic
  "✨ AI-powered" copy, bento grids of identical rounded cards,
  centred-everything layouts, or stock 3D blobs that don't relate to
  the content.
- No animation that plays the same way on every element. Vary the
  rhythm: some things snap, some drift, some wait.
- No placeholder lorem, no fake testimonials, no fake metrics. Use only
  facts present in `data/` and the existing copy.

### 3.3 The signature moments (this is where the "wow" lives)
Build these as the centrepieces. Each one must be meaningful (tied to who
Yashvanth is), interactive (it responds to the cursor, scroll or touch),
and degrade gracefully.

1. **Hero: "the living field."** Upgrade the existing raw-WebGL hero
   (`components/gl/hero-canvas.tsx` + `hero-shader.ts`) instead of
   replacing it. Push it toward the getlayers "Fluid & Iridescent" and
   "Waves & Terrain" quality:
   - Add a cheap **fluid / velocity field** driven by the cursor (a
     ping-pong FBO at low resolution is fine) so the pointer leaves a
     trail that the noise flow carries away. On touch, a slow
     autonomous drift.
   - Keep the **wordmark relief** (YASHVANTH pressed into the field,
     shredded by the cursor, re-forming at rest). Keep its placement
     rules from `CLAUDE.md`: lower-right, clear of the headline down to
     a 1024px window, and none on touch.
   - Subtle **chromatic dispersion** on the lime ridges, and a scroll-linked
     uniform so the field calms and darkens as the curtain rises.
   - Headline: per-character masked rise (already there), plus a
     **hover reaction** on desktop. Letters nearest the cursor gain a tiny
     weight or skew push (variable-font axis if available, otherwise a
     transform), never enough to hurt legibility.
   - If raw WebGL becomes unmanageable for the fluid pass, you may
     introduce **`ogl`** (≈ 8 KB) or **`three`** for this scene only,
     lazily imported. Justify it in the PR summary and update
     `CLAUDE.md`.

2. **Selected Work: "cinematic stack."** Keep the sticky stacked panels
   (outgoing panel scales to 0.955 and dims; z-index ascends). Add:
   - A **WebGL image-distortion layer** for project covers. On hover,
     a displacement/ripple follows the cursor. While scrolling,
     velocity-based RGB shift and slight bend. Use one shared canvas over
     the DOM images (the "DOM-to-WebGL sync" technique), not one context
     per card. When there's no screenshot, the generative typographic
     cover from `components/ui/project-cover.tsx` is used as the texture
     (render it to a canvas).
   - A **project counter / progress rail** (`01 / 03`) that scrubs with
     the stack.
   - On mobile there's no sticky stack: plain cards with a reveal and a tap
     state.

3. **About: "the person."** Portrait with a **dither / halftone shader**
   (getlayers "Dither Art") that resolves into the real photo on hover or
   when in view. The manifesto reveals line by line, with the serif-accent
   words lighting up last. Counters stay.

4. **Stack: "the instrument panel."** Replace the static chip wall with
   something tactile. Options, pick the best one and justify it:
   (a) a physics-light field of mono labels that repel from the cursor
   and settle into category columns, or (b) an **ASCII / character-grid
   render** (getlayers "ASCII Studio") of tech glyphs that scramble into
   names on hover. It must stay a real accessible list underneath
   (screen readers get `<ul>` semantics).

5. **Footer: "the closing beat."** Keep the outsized YASHVANTH wordmark
   rising on scrub. Add a final interactive touch: the letters respond to
   the cursor like the hero relief (a lightweight 2D/CSS version is fine),
   so the page ends where it began.

6. **Custom cursor, upgraded.** Keep the dot + lagging ring. Add contextual
   states: "View" label over project covers, "Copy" over the email, a drag
   hint over draggable things, and a magnetic snap to buttons. Desktop
   only, hidden under reduced motion, never on `/lilmoney`.

7. **Page transitions.** A brief, elegant transition between `/` and
   `/work` (View Transitions API where supported, with a GSAP clip-path
   wipe as fallback). It must not delay navigation by more than ~400 ms
   and is skipped under reduced motion.

8. **Micro-interactions everywhere, all quiet.** Text scramble on nav
   hover, `link-line` underline draws, magnetic CTAs, live Chennai clock,
   copy-email feedback, a form that responds to focus with a hairline
   accent sweep, and a send success state with a small particle or line
   burst in lime.

### 3.4 The `/work` page
Elevate the repo list into an **index**: large hover rows where hovering a
repo floats a small preview card (language, stars, topics) next to the
cursor. Add filtering by language (mono chips), a count, and keyboard
navigation (↑/↓, Enter). Keep data client-fetched from `/repos.json`.

### 3.5 Sound (optional, off by default)
A muted-by-default toggle in the navbar for very subtle UI ticks (hover,
click, section change) through Web Audio. Self-hosted, < 30 KB total,
remembers the preference in `localStorage` (wrapped in try/catch). Skip
this if it threatens the budget.

---

## 4. Responsive and accessibility

- Design and verify at **375, 768, 1024, 1440 and 1920** px wide. No
  horizontal scroll at any width (watch long tokens like the email address).
- Touch: 44 px targets (`.tap-safe` / `.tap-row` already exist), no
  hover-only information, no cursor-only interactions without a touch
  equivalent.
- Keyboard: everything reachable, visible lime focus ring, skip link
  works, single-letter shortcuts (from `data/sections.ts`) keep working
  and are ignored inside inputs.
- Screen readers: split text keeps an accessible original (`aria: "auto"`
  / `sr-only` copies), canvases are `aria-hidden`, and decorative motion
  has no semantic meaning.
- Contrast: body text ≥ 4.5:1 against `--bg-0`. Lime text only at sizes
  or weights that pass.

---

## 5. Fix while you're in there (found in a full read of the repo)

1. `components/gl/hero-canvas.tsx`: when the context is restored, `init()`
   runs again without disconnecting the previous `IntersectionObserver`,
   `ResizeObserver` or listeners. Make init/teardown idempotent.
2. Section numbers (`"01"`…`"06"` in section headers, `"04"` in `now.tsx`)
   are typed by hand and disagree with `MobileProgress`, which counts the
   hero as `01`. Derive them from `data/sections.ts` with one rule applied
   everywhere.
3. `footer.tsx` and `kbd-shortcuts.tsx` compare against the literal
   `"home"`. Use `HERO_ID`.
4. `app/layout.tsx` hard-codes the site URL and social URLs that already
   live in `data/site.ts` and `data/socials.tsx`. Use the constants.
   Settle on one display name, using `NAME` from `data/site.ts`.
5. `components/sections/now.tsx` `lastUpdated` is stale (2026-05-10).
   Leave the content alone but flag it in your summary. Don't invent new
   "now" items.
6. Update `CLAUDE.md` so it matches reality: the shader uniform count,
   any new libraries, new motion and WebGL architecture, and a short note
   that `/lilmoney` exists and is out of scope for portfolio styling.

---

## 6. How to work

Work in **phases**. At the end of each phase run `npm run lint` and
`npm run build`, fix everything, then post a short checkpoint: what
changed, bundle size of `/`, anything you're unsure of. Commit after
each phase on a branch `redesign/cinematic` (never on `main`) with clear
messages. Don't push.

1. **Phase 0, audit and plan (no code).** Read everything. Write a
   one-page plan: the motion system, which signature moments go in, the
   library decision (raw WebGL vs `ogl` vs `three`, with KB cost), and
   the risks. Then pause and wait for approval.
2. **Phase 1, foundations.** Token refinements, motion primitives (shared
   easing and duration constants in TS mirrored from CSS tokens), a shared
   WebGL lifecycle helper (idle init, visibility pause, context loss, DPR
   cap, teardown), the cursor upgrade, and the fixes from §5.
3. **Phase 2, hero.** Fluid field, wordmark relief, headline hover
   reaction, scroll-linked calm-down.
4. **Phase 3, Selected Work.** Shared distortion canvas, cinematic stack
   polish, progress rail, mobile cards.
5. **Phase 4, About, Stack, Contact, Footer.** Dither portrait,
   instrument panel, form micro-interactions, closing beat.
6. **Phase 5, `/work` and page transitions.**
7. **Phase 6, polish and verification.** Do a pass on timing: every
   reveal's delay and ease, considered together as one score. Run
   Lighthouse (mobile and desktop) and record the numbers. Test reduced
   motion, JS-disabled rendering (all content visible), WebGL disabled
   (fallbacks look intentional), and all five widths. Run the app and
   take screenshots at each width for the summary if a browser tool is
   available.

**Rules of engagement**
- Read before you edit. Match the existing code style: double quotes,
  readable JSX, comments that explain *why*, at about the current density.
- No new dependency without stating its gzipped size and why it beats
  writing the thing yourself. Allowed without asking: `ogl` or `three`
  (scene chunk only), `@gsap/react` (already present). Avoid heavy
  UI kits, Framer Motion (GSAP owns motion) and any CSS-in-JS.
- Every programmatic scroll goes through `useScrollTo()`. Never call
  `scrollIntoView` directly.
- Pins and scrubs live inside
  `gsap.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)")`.
- Clean up every tween, ScrollTrigger, observer, listener and GL resource
  on unmount. Fast-refresh in dev must not stack animations.
- If something in this brief conflicts with the budget or accessibility,
  the budget and accessibility win. Say what you cut and why.
- Report honestly. If a Lighthouse number misses its budget, say so with
  the number.

---

## 7. Definition of done

- [ ] All seven signature moments shipped, or explicitly cut with a reason
- [ ] Budgets in §2 met, with measured numbers reported
- [ ] Works and looks deliberate at 375 / 768 / 1024 / 1440 / 1920
- [ ] Reduced motion, no JS, and no WebGL each render a complete, attractive page
- [ ] `/lilmoney` is visually and behaviourally unchanged
- [ ] CSP and security headers intact; contact form still validated, rate-limited and honeypotted
- [ ] `npm run lint` and `npm run build` are clean
- [ ] `CLAUDE.md` updated to match the new architecture
- [ ] Final summary: what was built, the numbers, known gaps, and what you'd do next
