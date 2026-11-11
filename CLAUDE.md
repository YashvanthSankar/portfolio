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
Minimal, black-and-white, one typeface (Geist Mono), one column, with the
ASCII hands across the hero. No animation library, no WebGL, no custom
cursor. Almost everything is a server component; the only client code is
the theme toggle, the phone menu, the command menu, the hands' effects
(`hands-fx.tsx`), the Chennai clock, the contact form and the `/work`
language filter.

### Routes

- `/` → `app/page.tsx` renders the sections in `components/sections/` in
  order. Revalidates hourly, because the Activity section reads GitHub's
  public events API (`lib/github.ts`; it returns null on failure and the
  section falls back to `repos.json`, so the build never depends on it)
- `/work` → every public GitHub repo, imported from `public/repos.json`
  at build time; language filter
- `/api/contact` → POST, Zod-validated, rate-limited, honeypot, sends via **Resend**
- `/api/card` → plain-text card; `next.config.ts` rewrites `/` here for curl/wget
- `/YashvanthS_Resume.pdf` → redirect to the PDF GitHub Pages publishes from
  the `YashvanthSankar/resume` repo (`resume.tex` is the source; CI rebuilds it)

The display name is `NAME` ("Yashvanth S") from `data/site.ts`; the full
surname appears only in the JSON-LD `alternateName` and keywords for search.

### Design system

Everything lives in `app/globals.css` — there is no `tailwind.config.ts`
(Tailwind v4 is CSS-first via `@theme inline`).

- Colour tokens: `--bg`, `--ink`, `--muted`, `--surface`, `--line` for the
  hairline above each section, and `--art` for the ASCII hands. Black is the
  default regardless of the system preference; white applies only under
  `data-theme="light"`.
  Exposed to Tailwind as `bg-bg`, `text-ink`, `text-muted`, `bg-surface`.
- Theme: `components/theme-toggle.tsx` writes `data-theme` on `<html>` and
  `localStorage.theme`; an inline script in `app/layout.tsx` replays the
  stored choice before first paint.
- Hero: `components/hands.tsx` draws the hands from The Creation of Adam as
  an SVG of `<text>` rows from `data/hands.ts` (generated — rebuild with
  `node scripts/ascii-hands.mjs <image>`, never edit by hand). The script
  reads the wallpaper's own 400-column character grid back glyph for glyph;
  its `LABELS` constant names the glyph clusters and needs re-checking
  against the debug `templates.png` if the source image ever changes.
  `.caret` is the blinking cursor between the fingertips; the script finds
  its cell (`HANDS_CARET`). The art is split there into `.hand-l` and
  `.hand-r`. `components/hands-fx.tsx` (client, renders nothing) scrambles
  the characters near the pointer and sets `--close` on scroll so the hands
  drift together by `REACH` columns. From 1024px
  `.hero-copy` is pulled up into the empty corner under the left hand.
- Layout: `.col` is the single column (`min(100% - 2.5rem, 60rem)`,
  centred). Every section after the hero is `col section` (`.section` gives
  the gap and the hairline; it and the header breakpoint classes are
  unlayered on purpose so no utility can override them). A `.section` has
  **exactly two children**, heading then body; from 800px they sit side by
  side with the heading in an 11rem left rail. `.measure` caps running text
  at 68ch.
- Type: Geist Mono everywhere. `.h-page` (the one h1 per page), `.h-section`
  and `.h-item` (body-sized, weight 600), `.small`. Body is 15px / 1.7.
  Three sizes on the page, no more.
- Components: `.link` (underlined), `.btn` (filled ink), `.btn-quiet`,
  `.field` (form input on `--surface`), `.shot` (greyscale project
  screenshot), `.activity` (the one-character-a-day GitHub row).
- Command menu: `components/command-palette.tsx`, mounted once in
  `app/layout.tsx`. ⌘K, Ctrl+K or `/` opens it; the header's `⌘K` button
  fires the `palette:open` window event. Its sections and socials come from
  `data/sections.ts` and `data/socials.ts`, so new ones appear on their own.
- Share images are static PNGs (`app/opengraph-image.png`,
  `app/twitter-image.png` and the same pair under `app/work/`), each with an
  `.alt.txt`. They are screenshots of the hero at 1200 × 630; if the name,
  role or art changes they have to be re-made by hand.

Rules:
- **No accent colour.** Emphasis is weight or ink-vs-muted, never hue.
- **No boxes, shadows, gradients, icons or radii.** The only lines are the
  section hairlines; surfaces differ by a tone step (`--surface`).
- **Motion lives in the hero only**: the hands print in row by row on load,
  the copy fades in, the caret blinks, characters scramble under the
  pointer and the hands close on scroll. All of it is off under
  `prefers-reduced-motion`. Everywhere else: colour/opacity transitions on
  hover, nothing more. No scroll-reveal on sections.
- **No second typeface, no uppercase tracked labels, no section numbers, no
  terminal costume** (fake prompts, window chrome). The one shell command
  shown, `curl yashvanth.com`, is there because it really works.

### Data

Static content, no CMS — `data/projects.ts`, `data/experience.ts`,
`data/achievements.ts`, `data/now.ts` (update `nowUpdated` when it
changes), `data/technologies.ts`,
`data/socials.ts`, types in `data/types.ts`. `data/site.ts` holds the identity
constants (`NAME`, `ROLE`, `EMAIL`, `SITE_URL`, `GITHUB_URL`, `RESUME_URL`);
anything appearing in two places belongs there.

`data/sections.ts` lists the home page's sections and is the source of the
desktop header links (`inNav`), the phone menu and the footer links. Adding a section means adding
one row there plus its component in `app/page.tsx`.

Adding a project: append to `data/projects.ts`. An optional `image` is a
1200 × 750 screenshot in `public/work/`; it is shown in greyscale.

### Constraints

- Security headers and CSP are set in `next.config.ts` — **do not remove
  them**. Adding an external origin (script, font, API) means updating the CSP.
- The Resend client must stay constructed *inside* the request handler; at
  module scope it throws during `next build` when `RESEND_API_KEY` is absent.
- Path alias `@/*` → repo root.
