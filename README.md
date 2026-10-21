# yashvanth.com

The personal site of **Yashvanth S**, a full-stack developer and AI engineer
in Chennai. Black and white, one column, one typeface, light and dark.

**[yashvanth.com](https://yashvanth.com)** · [All repositories](https://yashvanth.com/work) · [Résumé](https://yashvanth.com/YashvanthS_Resume.pdf)

```bash
curl yashvanth.com    # the same site, as plain text
```

## What's on it

| Section | Source |
|---|---|
| Selected work | `data/projects.ts` |
| Experience | `data/experience.ts` |
| Achievements | `data/achievements.ts` |
| Now | `data/now.ts` |
| About | `components/sections/about.tsx` |
| Stack | `data/technologies.ts` |
| Contact | form → `/api/contact` → Resend |

`/work` lists every public GitHub repository from `public/repos.json`,
with a language filter.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4, tokens in `app/globals.css` |
| Type | Geist |
| Mail | Resend, with Zod validation, a rate limit and a honeypot |
| Hosting | Vercel |

No animation library, no WebGL, no UI kit. Almost everything is a server
component; the only client code is the theme switch, the phone menu, the
Chennai clock, the contact form and the `/work` filter.

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build      # production build
npm run lint       # ESLint
npm run repos      # refresh public/repos.json from GitHub
```

`npm run build` and `npm run lint` are the checks; there is no test suite.

### Environment

```bash
RESEND_API_KEY=re_…   # contact form; without it /api/contact returns 503
GITHUB_TOKEN=ghp_…    # optional, raises the rate limit for `npm run repos`
```

## Editing

Everything a visitor reads lives in `data/`.

- **Name, role, email, links:** `data/site.ts`. Anything shown in two places
  belongs there.
- **A project:** append to `data/projects.ts`.
- **A role:** add to `data/experience.ts`, newest first.
- **A win:** add to `data/achievements.ts`.
- **This season:** edit `data/now.ts` and update `nowUpdated`.
- **A section:** add a row to `data/sections.ts` (it feeds the header, the
  phone menu and the footer) and its component to `app/page.tsx`.

## Design

Four colour tokens, `--bg`, `--ink`, `--muted` and `--surface`, plus `--line`
for the hairline between sections. Light by default; dark follows the system
or the switch in the header, and the choice is remembered.

- No accent colour. Emphasis is weight, or ink against muted.
- No shadows, gradients, icons or rounded corners.
- No motion beyond colour on hover.
- One column, 42rem wide; five type sizes.

## Résumé

The résumé has its own repository,
[YashvanthSankar/resume](https://github.com/YashvanthSankar/resume).
`resume.tex` is the source; a GitHub Action rebuilds the PDF on every push
and GitHub Pages publishes it. `yashvanth.com/YashvanthS_Resume.pdf`
redirects there, so the site always links the current version.

## Layout

```
app/               routes, metadata, OG images
  api/contact/     contact form endpoint
  api/card/        the plain-text card curl gets
  work/            all repositories
components/        header, phone menu, footer, theme switch, clock
  sections/        one file per home-page section
data/              all content
lib/               rate limiter, helpers
```

Security headers and the CSP are set in `next.config.ts`.

## License

Content and design © Yashvanth S. The code is free to read and learn from.
