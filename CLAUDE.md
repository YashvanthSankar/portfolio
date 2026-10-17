# CLAUDE.md

Guidance for Claude Code (claude.ai/code) when working in this repository.

## Commands

```bash
npm run dev     # development server
npm run build   # production build
npm run start   # serve production build
npm run lint    # ESLint
npm run repos   # refresh public/repos.json from the GitHub API
                # set GITHUB_TOKEN to avoid the 60 req/hr anonymous limit
```

No test suite is configured. `npm run build` + `npm run lint` are the gate.

## Architecture

**Next.js 16 App Router**, React 19, TypeScript strict, Tailwind CSS v4.
Dark-only, cinematic, scroll-driven. GSAP owns motion; Lenis owns scrolling.

### Routes

- `/` → `app/page.tsx` → `components/portfolio.tsx` orchestrates all sections
- `/work` → every public GitHub repo, client-fetched from `/public/repos.json`;
  language filter, a preview card that trails the pointer, ↑/↓ row navigation
- `/api/contact` → POST, Zod-validated, rate-limited, sends via **Resend**
- `/lilmoney/**` → a separate product site (LilMoney) with its own light
  design system in `app/lilmoney/littlemoney.module.css` and legal copy in
  `data/littlemoney-legal.ts`. **Out of scope for portfolio styling**: the
  cursor, page transitions and WebGL never mount there, and nothing in the
  portfolio's globals should leak in. It inherits the root layout's
  `authors` / `creator` / `publisher` / `keywords` metadata, which is why
  those stay the short form "Yashvanth S" while the portfolio title uses
  `NAME` from `data/site.ts`.

`components/providers/page-transition.tsx` wipes a page-colour curtain
between `/` and `/work`. It catches internal link clicks at the document
(capture phase), so no link component knows about it; a same-route hash
link becomes a `scrollTo()` instead of a navigation. Skipped under reduced
motion, with a 2.5 s failsafe if a route is slow.

### Design system

Everything lives as CSS custom properties in `app/globals.css` — there is no
`tailwind.config.ts` (Tailwind v4 is CSS-first via `@theme inline`).

| Group | Tokens |
|---|---|
| Canvas | `--bg-0` page · `--bg-1` raised · `--bg-2` hover |
| Text | `--text-1` primary · `--text-2` body · `--text-3` mono meta |
| Lines | `--line-1` default hairline · `--line-2` hover/active |
| Accent | `--accent` `#C8F04B` · `--accent-dim` · `--glow-accent` |
| Type | `--display-xl/lg/md`, `--lead`, `--meta` (all fluid `clamp()`) |
| Rhythm | `--section-pad`, `--gutter`, `--container` |
| Motion | `--ease-out`, `--ease-io`, `--dur-fast/base/slow` |

Utility classes: `.display-xl/lg/md`, `.lead`, `.meta` (mono uppercase label),
`.serif-accent` (Instrument Serif italic — **2–4 words per section, never
more**), `.panel`, `.btn` + `.btn-primary/outline/ghost/sm`, `.link-line`.

Touch targets: the design leans on 16px glyphs and hairline links, which are
poor thumb targets. `.tap-safe` grows a control's hit area to 44px on coarse
pointers using a centred pseudo-element, so nothing moves or re-flows;
`.tap-row` widens icon-row gaps so those larger targets tile instead of
overlapping. Both live **outside `@layer components`** on purpose — `.tap-row`
has to beat the `gap-*` utility on the same element, and every layer loses to
unlayered CSS.

Rules that hold the look together:
- **One accent.** Lime marks state and one CTA per view. Never decorative.
- **Hairlines, not boxes.** 1px `--line-1`; borders separate, they don't frame.
- **Mono for metadata only.** Labels, counts, dates, tags — never body copy.
- No shadows except `--glow-accent`; no radii beyond `--radius` (2px).

### Motion architecture

- `lib/motion.ts` mirrors the CSS `--ease-*` / `--dur-*` tokens for GSAP
  (`EASE`, `DUR`, `STAGGER`, `REVEAL_START`, `SCRUB`) and holds
  **`DESKTOP_MOTION`**, the one media query every pin, scrub and parallax
  is gated behind. Import it; never retype the string.
- `components/providers/smooth-scroll.tsx` owns the Lenis instance, drives it
  from `gsap.ticker`, and exposes **`useScrollTo()`**. Every programmatic
  scroll goes through it — never call `scrollIntoView` directly.
- `lib/gsap.ts` registers ScrollTrigger + SplitText once.
- `lib/split-reveal.ts` — `splitReveal()` for line/char reveals, `fadeUp()`
  for everything else. While webfonts are still loading, `splitReveal()`
  holds the heading hidden (from JS) and splits once on
  `document.fonts.ready`, so line breaks are never measured against the
  fallback font.
- Pointer hooks, all fine-pointer only and no-ops under reduced motion:
  `lib/use-char-proximity.ts` (display letters rise, lean away and grow
  near the pointer — hero headline and footer wordmark share it),
  `lib/use-repel.ts` (elements spring away from the pointer via
  `quickSetter`, so a reveal tween keeps ownership of the transform — the
  stack chips), `lib/use-magnetic.ts` (buttons lean toward it).
- `components/cursor.tsx` has four ring states: idle, hover, a filled
  plate that speaks a word for any `data-cursor="view|copy|drag|open"`
  element, and a rectangle that snaps to any `.btn`. Size and position
  are eased in JS; only paint transitions live in CSS.
- **Hidden state comes from JS** (`gsap.set(autoAlpha: 0)` / inline
  `style={{ opacity: 0 }}` paired with a reveal). Never hide content in CSS
  that JS must reveal — failed JS must still render readable text. The
  inline `opacity: 0` targets are covered by a `<noscript>` rule in
  `app/layout.tsx` that forces them visible when scripts are off.
- **Reduced motion means "skip the tween", not "skip the reveal".** Callers
  of `fadeUp()` ship `style={{ opacity: 0 }}`, so a no-op branch leaves whole
  sections permanently blank. `fadeUp()` therefore still sets `autoAlpha: 1`
  when motion is off. `splitReveal()` can genuinely no-op — its targets are
  visible in the markup. Any new reveal helper must follow the same rule.
- Pins and scrubs live inside `gsap.matchMedia("(min-width: 768px) and
  (prefers-reduced-motion: no-preference)")`. Mobile gets plain reveals.

### Scroll choreography

- **Hero** is `sticky top-0 z-0`; the rest of the page (`z-10`, opaque `--bg-0`)
  scrolls over it as a curtain. Hero content scrubs to 15% opacity as it goes.
  Because it is sticky, its bounding rect reads `(0, viewportHeight)` from
  everywhere below the fold — so it is excluded from the scroll-spy probe in
  `lib/use-active-section.ts` (it is the fallback instead), and `scrollTo()`
  rewrites `#home` to offset `0`. Both are load-bearing; without them the
  indicators stick on "Intro" and "back to intro" does nothing.
- **Selected Work** panels are `md:sticky md:top-0` siblings that stack; each
  outgoing panel scales to 0.955 and dims as the next slides over it. Panel
  z-index ascends by index — keep it that way or panels stack wrong.
- **Ticker** (`components/sections/ticker.tsx`) runs between the hero and
  Work — pure CSS, `aria-hidden`, still under reduced motion.
- **Selected Work** panels are full-bleed on desktop: the cover fills the
  panel and the copy sits bottom-left on a gradient scrim. Phones stack
  copy under a cover at its own 16/11 proportions.
- **Footer wordmark** chars rise on a scrub — the closing beat.

### WebGL

Raw WebGL throughout, no three.js. `lib/gl/` holds the shared pieces:
`program.ts` (compile/link, uniform lookup, the fullscreen triangle),
`fbo.ts` (RGBA8 render targets and a ping-pong pair — the one format
WebGL 1 guarantees, so signed values are encoded around 0.5) and
**`use-gl-surface.ts`**, the single lifecycle every scene runs on. A scene
is `{ resize, frame, dispose }`; the hook owns the context, the clock, DPR
cap, render scale, idle build (after fonts if asked), visibility pause,
context loss, and parking by distance (`loseContext()` when far,
`restoreContext()` when near — a canvas can only ever hold one context).
`frame()` may return `false` to say nothing was drawn yet (a texture still
loading), and `onFirstFrame` is where a DOM fallback gets hidden. Every
failure path leaves the fallback painted. Listeners are attached once,
outside the build path, so a restore can never stack a second set.

Three scenes:

- **Hero** — `hero-canvas.tsx` + `hero-scene.ts` + `hero-shader.ts`. Two
  programs. `FIELD_FRAG` steps a 192-wide trail simulation each frame
  (pointer velocity splatted in, advected along its own flow plus a drift,
  decayed with a dead zone so it vanishes fully). `FRAG_SHADER` is the
  picture: simplex → fbm → two-pass domain warp, with the trail bending the
  warp; lime appears only on a narrow ridge band, sampled per channel at a
  small offset so disturbed regions split into a faint spectrum. In the
  same pass it raymarches **the relic**: a noise-displaced sphere SDF with
  a dark liquid body, thin-film iridescence (kept to the cool half of the
  hue wheel — no hot reds), a lime key light and a lime halo. It sits in
  the right half (`u_relic`, `u_relicSize`), leans toward the pointer
  (`u_tilt`) and marches fewer steps on phones (`u_quality`). Keep its
  displacement low-frequency; high-frequency noise makes it read as rock.
  Ten uniforms: `u_res`, `u_time`, `u_pointer`, `u_disturb`, `u_calm`,
  `u_field`, `u_relic`, `u_relicSize`, `u_tilt`, `u_quality`.
  `u_calm` follows the page curtain (hero section progress): the field
  dims, the relic sinks, and the loop pauses once the hero is fully
  covered — a sticky hero is "visible" at every scroll position, so
  visibility alone never pauses it.

  The hero copy is bottom-anchored with "Sankar." stepped in, so the
  headline overlaps the relic's left edge on desktop. That overlap is
  deliberate; white display type stays legible over the dark body.
- **Cover sheets** — `cover-scene.ts` + `cover-shader.ts`, one per
  Selected Work cover, mounted only on fine-pointer desktops
  (`useMediaQuery` in `components/ui/project-cover.tsx`). The texture is
  the generative art rasterised from the shared maths in
  `lib/cover-art.ts` (or the screenshot `<img>`); the pointer ripples it,
  scrolling bends it and splits its channels; at rest it draws one clean
  frame and sleeps. Text plates stay in the DOM above it. A single shared
  canvas was ruled out: the panels are sticky siblings with ascending
  z-index, and no one canvas can sit between panel N's image and panel
  N+1 sliding over it.
- **Portrait** — `dither-scene.ts` + `dither-shader.ts` in About. An 8×8
  Bayer print in the page's two tones (lime on the threshold edge) that
  resolves into the photo over 1.6 s; the pointer un-resolves a soft disc.

At any scroll position at most two contexts are live.

Non-negotiable guarantees: init deferred to `requestIdleCallback` (the hero
headline is LCP), DPR capped and rendered at 0.8 internal scale, rAF paused
when offscreen or backgrounded, `webglcontextlost` handled, `loseContext()`
on unmount, and `.hero-fallback` (CSS gradient) always painted underneath so
every failure path degrades silently.

### Data

Static content, no CMS — `data/projects.ts`, `data/experience.ts`,
`data/technologies.ts`, `data/socials.ts`, types in `data/types.ts`.
`data/site.ts` holds the identity constants (email, URL, GitHub, `NAME`);
anything appearing in two places belongs there.

Social icons are one `<symbol>` sprite (`components/ui/social-icon.tsx`,
rendered once by the navbar) and every glyph is a `<SocialIcon icon>`
`<use>` — they appear in four places and inlining them was a sixth of the
home page's HTML. The stack's brand icons are decorative and render only
after hydration (`lib/use-hydrated.ts`) for the same reason.

`data/sections.ts` is the page's chapter registry and the **single source of
truth** for the navbar, the desktop section index, the mobile progress
cluster, the keyboard shortcuts, and the footer sitemap. Adding a section
means adding one row there and nothing else — never re-declare the list in
a component. **Chapter numbers come from `chapterNumber(id)`** (the hero is
`00`, Work is `01`); never type one by hand, and compare against `HERO_ID`,
never the literal `"home"`.

Adding a project: append to `data/projects.ts`. `image` is optional — without
one, `components/ui/project-cover.tsx` generates a typographic cover seeded
from the title, so a missing screenshot still looks deliberate.

### Constraints

- Security headers and CSP are set in `next.config.ts` — **do not remove
  them**. Adding an external origin (script, font, API) means updating the CSP.
- The Resend client must stay constructed *inside* the request handler; at
  module scope it throws during `next build` when `RESEND_API_KEY` is absent.
- Path alias `@/*` → repo root.
