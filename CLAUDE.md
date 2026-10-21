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
Minimal, black-and-white, one typeface (Geist), one column. No animation
library, no WebGL, no custom cursor. Almost everything is a server
component; the only client code is the theme toggle, the Chennai clock,
the contact form and the `/work` language filter.

### Routes

- `/` → `app/page.tsx` renders the sections in `components/sections/` in order
- `/work` → every public GitHub repo, imported from `public/repos.json`
  at build time; language filter
- `/api/contact` → POST, Zod-validated, rate-limited, honeypot, sends via **Resend**
- `/lilmoney/**` → a separate product site (LilMoney) with its own light
  design system in `app/lilmoney/littlemoney.module.css` and legal copy in
  `data/littlemoney-legal.ts`. **Out of scope for portfolio styling.** It
  inherits the root layout's `authors` / `creator` / `publisher` / `keywords`
  metadata, which is why those stay the short form "Yashvanth S" while the
  portfolio title uses `NAME` from `data/site.ts`.

### Design system

Everything lives in `app/globals.css` — there is no `tailwind.config.ts`
(Tailwind v4 is CSS-first via `@theme inline`).

- Four colour tokens: `--bg`, `--ink`, `--muted`, `--surface`. Light is the
  default; dark applies under `prefers-color-scheme: dark` unless
  `data-theme="light"` is set, and always under `data-theme="dark"`.
  Exposed to Tailwind as `bg-bg`, `text-ink`, `text-muted`, `bg-surface`.
- Theme: `components/theme-toggle.tsx` writes `data-theme` on `<html>` and
  `localStorage.theme`; an inline script in `app/layout.tsx` replays the
  stored choice before first paint.
- Layout: `.col` is the single column (`min(100% - 2.5rem, 42rem)`,
  centred). Every section is `col` + `mt-28`.
- Type: `.h-page` (the one h1 per page), `.h-section`, `.h-item`, `.small`.
  Body is 17px / 1.6. Five sizes on the page, no more.
- Components: `.link` (underlined), `.btn` (filled ink), `.btn-quiet`,
  `.field` (form input on `--surface`).

Rules:
- **No accent colour.** Emphasis is weight or ink-vs-muted, never hue.
- **No lines, boxes, shadows, gradients, icons or radii.** Surfaces differ
  by a tone step (`--surface`) only.
- **No motion** beyond colour/opacity transitions on hover.
- **No monospace, no uppercase tracked labels, no section numbers.**

### Data

Static content, no CMS — `data/projects.ts`, `data/experience.ts`,
`data/now.ts` (update `nowUpdated` when it changes), `data/technologies.ts`,
`data/socials.ts`, types in `data/types.ts`. `data/site.ts` holds the identity
constants (`NAME`, `ROLE`, `EMAIL`, `SITE_URL`, `GITHUB_URL`, `RESUME_URL`);
anything appearing in two places belongs there.

`data/sections.ts` lists the home page's sections and is the source of the
header links (`inNav`) and the footer links. Adding a section means adding
one row there plus its component in `app/page.tsx`.

Adding a project: append to `data/projects.ts`. `image` is optional; with one,
the screenshot (in `public/`) is shown above the title.

### Constraints

- Security headers and CSP are set in `next.config.ts` — **do not remove
  them**. Adding an external origin (script, font, API) means updating the CSP.
- The Resend client must stay constructed *inside* the request handler; at
  module scope it throws during `next build` when `RESEND_API_KEY` is absent.
- Path alias `@/*` → repo root.
