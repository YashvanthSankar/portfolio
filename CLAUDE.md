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
- `/work` → every public GitHub repo, client-fetched from `/public/repos.json`
- `/api/contact` → POST, Zod-validated, rate-limited, sends via **Resend**

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

Rules that hold the look together:
- **One accent.** Lime marks state and one CTA per view. Never decorative.
- **Hairlines, not boxes.** 1px `--line-1`; borders separate, they don't frame.
- **Mono for metadata only.** Labels, counts, dates, tags — never body copy.
- No shadows except `--glow-accent`; no radii beyond `--radius` (2px).

### Motion architecture

- `components/providers/smooth-scroll.tsx` owns the Lenis instance, drives it
  from `gsap.ticker`, and exposes **`useScrollTo()`**. Every programmatic
  scroll goes through it — never call `scrollIntoView` directly.
- `lib/gsap.ts` registers ScrollTrigger + SplitText once.
- `lib/split-reveal.ts` — `splitReveal()` for masked line/char reveals,
  `fadeUp()` for everything else. Both no-op under reduced motion and
  re-split after `document.fonts.ready`.
- **Hidden state comes from JS** (`gsap.set(autoAlpha: 0)` / inline
  `style={{ opacity: 0 }}` paired with a reveal). Never hide content in CSS
  that JS must reveal — failed JS must still render readable text.
- Pins and scrubs live inside `gsap.matchMedia("(min-width: 768px) and
  (prefers-reduced-motion: no-preference)")`. Mobile gets plain reveals.

### Scroll choreography

- **Hero** is `sticky top-0 z-0`; the rest of the page (`z-10`, opaque `--bg-0`)
  scrolls over it as a curtain. Hero content scrubs to 15% opacity as it goes.
- **Selected Work** panels are `md:sticky md:top-0` siblings that stack; each
  outgoing panel scales to 0.955 and dims as the next slides over it. Panel
  z-index ascends by index — keep it that way or panels stack wrong.
- **Footer wordmark** chars rise on a scrub — the closing beat.

### WebGL hero

`components/gl/hero-canvas.tsx` + `hero-shader.ts`. Raw WebGL, no three.js:
one program, one fullscreen triangle, three uniforms (`u_time`, `u_res`,
`u_pointer`). Simplex → fbm → two-pass domain warp; lime appears only on a
narrow ridge band so it reads as filaments, not a wash.

Non-negotiable guarantees: init deferred to `requestIdleCallback` (the hero
headline is LCP), DPR capped and rendered at 0.8 internal scale, rAF paused
when offscreen or backgrounded, `webglcontextlost` handled, `loseContext()`
on unmount, and `.hero-fallback` (CSS gradient) always painted underneath so
every failure path degrades silently.

### Data

Static content, no CMS — `data/projects.ts`, `data/experience.ts`,
`data/technologies.ts`, `data/socials.tsx`, types in `data/types.ts`.

Adding a project: append to `data/projects.ts`. `image` is optional — without
one, `components/ui/project-cover.tsx` generates a typographic cover seeded
from the title, so a missing screenshot still looks deliberate.

### Constraints

- Security headers and CSP are set in `next.config.ts` — **do not remove
  them**. Adding an external origin (script, font, API) means updating the CSP.
- The Resend client must stay constructed *inside* the request handler; at
  module scope it throws during `next build` when `RESEND_API_KEY` is absent.
- Path alias `@/*` → repo root.
