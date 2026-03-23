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

**Next.js 16 App Router** portfolio site with TypeScript, Tailwind CSS v4, and Framer Motion.

### Routing

- `/` → `app/page.tsx` renders `<Portfolio />` which orchestrates all page sections
- `/work` → dedicated work/projects sub-page with its own navbar
- `/api/contact` → POST endpoint using **Resend** to send contact form emails

### Component Structure

- `components/sections/` — page sections (Hero, Navbar, Projects, Experience, Contact, Footer, TechMarquee, AboutBento)
- `components/ui/` — reusable visual primitives (Spotlight, GlowingEffect, MovingBorder, Timeline, CardSpotlight, etc.) sourced from **Aceternity UI** and **Magic UI**
- `components/portfolio.tsx` — top-level wrapper that lazy-loads all sections with `next/dynamic`
- `components/theme-provider.tsx` / `theme-toggle.tsx` — wraps **next-themes** with class-based dark mode

### Data Layer

All content is static — no database or CMS:
- `data/types.ts` — TypeScript interfaces (`Project`, `TechItem`, `TechCategory`, `Experience`)
- `data/projects.ts`, `data/experience.ts`, `data/technologies.ts` — content arrays

### Styling

- **Tailwind CSS v4** with `@tailwindcss/postcss`
- Dark mode via `class` strategy (toggled by next-themes with storage key `portfolio-theme`)
- Primary accent: `hsl(190 100% 50%)` cyan
- Custom keyframe animations defined in `tailwind.config.ts`: `marquee`, `moveVertical`, `moveInCircle`, `moveHorizontal`, `grid`, `spotlight`
- `lib/utils.ts` exports `cn()` (clsx + tailwind-merge), `shouldAnimate()` (respects `prefers-reduced-motion`), and `throttle()`

### Key Patterns

- Heavy sections are lazy-loaded via `next/dynamic` in `portfolio.tsx`
- Animations use Framer Motion for component-level motion, Tailwind keyframes for CSS-only loops
- Always check `shouldAnimate()` before triggering motion to respect reduced-motion preference
- Path alias `@/*` maps to the repo root (`tsconfig.json`)
- Security and cache headers are set in `next.config.ts` (do not remove them)
