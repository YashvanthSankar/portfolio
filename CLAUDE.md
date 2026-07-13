# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
```

No test suite is configured.

## Architecture

**Next.js 16 App Router** portfolio site with TypeScript, Tailwind CSS v4, and Framer Motion (used sparingly, for `AnimatePresence` only).

### Routing

- `/` → `app/page.tsx` renders `<Portfolio />` which orchestrates all page sections
- `/work` → GitHub repo gallery; fetches static `public/repos.json` client-side (refresh it via `scripts/github_extractor.py`, then copy to `public/`)
- `/palette` → design-token visualizer for the monochrome system
- `/api/contact` → POST endpoint: Zod validation, honeypot field, in-memory rate limit (3/hr/IP, `lib/rate-limit.ts`), **Resend** email delivery

### Component Structure

- `components/sections/` — page sections (Hero, Navbar, Now, TechMarquee, About in `about-bento.tsx`, Projects, Experience, Contact, Footer)
- `components/ui/` — minimal primitives: `primitives.tsx` (Button, Tag, Dot), `section.tsx` (Section wrapper), `section-header.tsx`, `reveal.tsx` (IntersectionObserver scroll reveal)
- `components/portfolio.tsx` — top-level wrapper that lazy-loads heavy sections with `next/dynamic`
- `components/theme-provider.tsx` / `theme-toggle.tsx` — **next-themes**, class strategy, storage key `portfolio-theme`; toggle uses the View Transitions API for a circular theme wipe (flushSync-forced snapshot — see comment in `theme-toggle.tsx`)

### Data Layer

All content is static — no database or CMS:
- `data/types.ts` — TypeScript interfaces (`Project`, `TechItem`, `TechCategory`, `Experience`)
- `data/projects.ts`, `data/experience.ts`, `data/technologies.ts`, `data/socials.tsx` — content arrays

### Design System — minimal monochrome

`app/globals.css` is the source of truth (there is **no** `tailwind.config.ts`; Tailwind v4 reads the `@theme inline` block):

- Zero-hue tokens: `--paper` (page), `--surface` (cards), `--surface-hover`, `--ink` (text), `--muted`, `--faint`, `--line` (hairline borders), `--line-strong`. Exposed as Tailwind utilities (`bg-paper`, `text-ink`, `border-line`, …)
- Dark mode via `.dark` class (`@custom-variant`), toggled by next-themes
- Depth comes from 1px hairline borders and spacing — no colored accents, no hard shadows
- Shared rhythm: sections use `<Section>` (hairline top rule, `max-w-5xl px-6 py-24`); cards use the `.card` / `.card-hover` CSS classes; form inputs use `.field`
- Motion: CSS-only (`.fade-up` load stagger, `.reveal` scroll entrance via the `Reveal` component, `.marquee` loop, `.link-underline` micro-interaction). One shared easing family (`--ease-out`, `--ease-spring`)
- Fonts: Geist (`--font-display`) + Geist Mono (`--font-mono`); mono is reserved for small uppercase labels and meta text

### Key Patterns

- Keep it quiet: prefer hairlines, whitespace, and small hover transitions (color, 0.5–2px translate) over decoration
- Heavy sections are lazy-loaded via `next/dynamic` in `portfolio.tsx`
- Always check `shouldAnimate()` (`lib/utils.ts`) before JS-driven motion; a global `prefers-reduced-motion` kill-switch also lives in `globals.css`
- Scroll-driven behavior (nav scroll-spy, section index, counters, progress bar) uses plain scroll listeners / IntersectionObserver — no animation libraries
- Keyboard shortcuts (`components/kbd-shortcuts.tsx`): H/N/S/A/W/J/C jump to sections, T toggles theme, ? shows the cheat-sheet
- Path alias `@/*` maps to the repo root (`tsconfig.json`)
- Security and cache headers are set in `next.config.ts` (do not remove them)
