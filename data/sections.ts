export interface Section {
  /** DOM id of the section element. */
  id: string;
  label: string;
  /** Shown in the desktop header. */
  inNav?: boolean;
}

/**
 * The home page's sections in scroll order — the single source of truth
 * for the header, the phone menu and the footer links.
 */
export const sections: Section[] = [
  { id: "work", label: "Work", inNav: true },
  { id: "experience", label: "Experience" },
  { id: "achievements", label: "Achievements" },
  { id: "about", label: "About", inNav: true },
  { id: "stack", label: "Stack" },
  { id: "contact", label: "Contact", inNav: true },
];

export const navSections = sections.filter((s) => s.inNav);
