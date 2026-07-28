export interface Section {
  /** DOM id of the section element — anchors and scroll-spy both use it. */
  id: string;
  /** Sentence-case label. `.meta` uppercases it where that's the house style. */
  label: string;
  /** Single-key shortcut — see components/kbd-shortcuts.tsx. */
  key: string;
  /** Shown in the top navbar. Intro and Now deliberately are not. */
  inNav?: boolean;
}

/**
 * The page's chapters, in scroll order — the single source of truth for
 * the navbar, the desktop section index, the mobile progress cluster, the
 * keyboard shortcuts and the footer sitemap.
 *
 * Adding a section means adding one row here and nothing else.
 */
export const sections: Section[] = [
  { id: "home", label: "Intro", key: "h" },
  { id: "projects", label: "Work", key: "w", inNav: true },
  { id: "about", label: "About", key: "a", inNav: true },
  { id: "experience", label: "Experience", key: "e", inNav: true },
  { id: "now", label: "Now", key: "n" },
  { id: "technologies", label: "Stack", key: "s", inNav: true },
  { id: "contact", label: "Contact", key: "c", inNav: true },
];

/**
 * The hero. It is `sticky top-0` and first in the document, which makes it
 * a special case for both scrolling to it and scroll-spying past it — see
 * components/providers/smooth-scroll.tsx and lib/use-active-section.ts.
 */
export const HERO_ID = sections[0].id;

/** Chapters the top navbar links to. */
export const navSections = sections.filter((s) => s.inNav);

/** `{ w: "projects", a: "about", … }` — keyed by the shortcut letter. */
export const shortcutMap: Record<string, string> = Object.fromEntries(
  sections.map((s) => [s.key, s.id])
);
