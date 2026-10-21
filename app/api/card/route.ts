import { projects } from "@/data/projects";
import { socials } from "@/data/socials";
import { EMAIL, NAME, ROLE, SITE_URL } from "@/data/site";

/**
 * The site as plain text, for anyone who reaches it from a terminal.
 * next.config.ts rewrites `/` here when the user agent is curl, wget or
 * HTTPie. Everything is static data, so it is built once.
 */
const width = 72;
const line = "─".repeat(width);
const pad = (label: string, value: string) => `  ${label.padEnd(12)}${value}`;

const CARD = [
  "",
  `  ${NAME}`,
  `  ${ROLE}. Chennai, India.`,
  "",
  pad("web", SITE_URL),
  pad("email", EMAIL),
  ...socials.filter((s) => !s.noBlank).map((s) => pad(s.name.toLowerCase(), s.href)),
  "",
  line,
  "  Selected work",
  "",
  ...projects.flatMap((p) => [
    `  ${p.title}${p.year ? ` (${p.year})` : ""} — ${p.kind}`,
    `    ${p.live ?? p.github}`,
    "",
  ]),
  line,
  `  Open to work. Say hello: ${EMAIL}`,
  "",
].join("\n");

export const dynamic = "force-static";

export function GET() {
  return new Response(CARD, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
