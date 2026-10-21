# yashvanth.com

Personal portfolio. Minimal, black and white, light and dark.

**Live:** [yashvanth.com](https://yashvanth.com)

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4 (CSS-first tokens, no config file) |
| Type | Geist |
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
components/        header, footer, theme toggle, clock
  sections/        hero, work, experience, achievements, about, stack, contact
data/              all site content
lib/               rate limiter, helpers
```

## Editing content

Everything lives in `data/`. Add a project to `data/projects.ts`, a role to
`data/experience.ts`, tools to `data/technologies.ts`, and wins to
`data/achievements.ts`.

## License

Content and design © Yashvanth S. Code is free to learn from.
