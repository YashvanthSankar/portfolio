export interface Section {
  /** DOM id of the section element. */
  id: string;
  label: string;
  /** One line under the label on the menu card. */
  blurb: string;
}

/**
 * The home page's sections in scroll order — the single source of truth
 * for the menu and the footer links.
 */
export const sections: Section[] = [
  { id: "work", label: "Work", blurb: "Three things I've shipped." },
  { id: "experience", label: "Experience", blurb: "Study and an internship." },
  { id: "now", label: "Now", blurb: "What I'm building this season." },
  { id: "about", label: "About", blurb: "Who I am, where I am." },
  { id: "stack", label: "Stack", blurb: "Tools I reach for." },
  { id: "contact", label: "Contact", blurb: "Email or the form." },
];
