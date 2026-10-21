/**
 * "Now" — what I'm working on this season. Update `nowUpdated` when this
 * changes.
 */
export const nowUpdated = "2026-10-21";

export interface NowItem {
  title: string;
  role: string;
  detail: string;
  href?: string;
}

export const now: NowItem[] = [
  {
    title: "Promptli",
    role: "Developer",
    detail: "Building the lead-capture and conversion surface for promptli.com — voice AI agents that actually convert.",
    href: "https://promptli.com",
  },
  {
    title: "Denoise Labs",
    role: "Co-founder",
    detail: "A four-person studio for agentic AI, shipping opinionated AI products under one brand.",
    href: "https://denoiselabs.com",
  },
  {
    title: "Redpen & Refile",
    role: "Team product",
    detail: "Two Denoise Labs products in early development: quiet AI tools for writers and file workflows.",
  },
];
