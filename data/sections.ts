export interface Section {
  /** DOM id of the section element. */
  id: string;
  label: string;
  /** Shown in the header. */
  inNav?: boolean;
}

/**
 * The home page's sections in scroll order — the single source of truth
 * for the header links and the footer links.
 */
export const sections: Section[] = [
  { id: "work", label: "Work", inNav: true },
  { id: "experience", label: "Experience" },
  { id: "now", label: "Now" },
  { id: "about", label: "About", inNav: true },
  { id: "stack", label: "Stack" },
  { id: "contact", label: "Contact", inNav: true },
];

export const navSections = sections.filter((s) => s.inNav);
