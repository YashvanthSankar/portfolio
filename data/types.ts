export interface Project {
  title: string;
  description: string;
  tags: string[];
  /** Optional screenshot. Without one, a generative cover is derived
   *  from the title — see components/ui/project-cover.tsx. */
  image?: string;
  github?: string;
  live?: string;
  /** Short label for the cover plate, e.g. "AI Learning Platform". */
  kind?: string;
  year?: string;
}

export interface TechItem {
  name: string;
  icon: string;
}

export interface TechCategory {
  title: string;
  items: TechItem[];
}

export interface Experience {
  /** Role or qualification, e.g. "Backend Developer Intern". */
  title: string;
  organization?: string;
  /** Free text, e.g. "2024 – Present". `isOngoing()` parses the end of it. */
  period: string;
  description: string;
  tags?: string[];
  bullets?: string[];
  type: "education" | "work";
}
