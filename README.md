# yashvanth.com

Personal portfolio — a dark, scroll-driven site with a WebGL hero, built to be
fast first and cinematic second.

**Live:** [yashvanth.com](https://yashvanth.com)

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4 (CSS-first tokens, no config file) |
| Motion | GSAP + ScrollTrigger + SplitText, Lenis smooth scroll |
| Graphics | Raw WebGL — one shader, no three.js |
| Type | Geist Sans / Geist Mono / Instrument Serif |
| Mail | Resend |
| Hosting | Vercel |

## Running locally

```bash
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000).

### Environment

```bash
RESEND_API_KEY=re_…   # contact form; without it /api/contact returns 503
GITHUB_TOKEN=ghp_…    # optional, only for `npm run repos`
```

## Scripts

```bash
npm run dev      # development server
npm run build    # production build
npm run start    # serve the production build
npm run lint     # ESLint
npm run repos    # refresh public/repos.json from the GitHub API
```

## How it's put together

```
app/               routes, metadata, OG images, contact API
components/
  gl/              WebGL hero canvas + GLSL shader
  providers/       Lenis + ScrollTrigger wiring, useScrollTo()
  sections/        hero, work, about, experience, now, stack, contact, footer
  ui/              section header, project cover, text scramble
data/              all site content (projects, experience, stack, socials)
lib/               gsap setup, split-text reveals, rate limiter, helpers
```

A few decisions worth knowing:

- **The hero canvas never blocks the page.** It initialises on idle after
  first paint, pauses when scrolled away or backgrounded, and sits on top of a
  CSS gradient that shows through if WebGL is unavailable.
- **Motion is opt-out by default.** Every reveal, pin, and scrub is gated on
  `prefers-reduced-motion`, and hidden state is applied from JS so content is
  still readable if scripts fail.
- **Project screenshots are optional.** Without an image, a generative
  typographic cover is derived from the project title.

## Editing content

Everything lives in `data/`. Add a project to `data/projects.ts`, a role to
`data/experience.ts`, tools to `data/technologies.ts`. The "Now" section is
inline in `components/sections/now.tsx` — update `lastUpdated` when you change
it.

## License

Content and design © Yashvanth Sankar. Code is free to learn from.
