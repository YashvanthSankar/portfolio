export interface Project {
  title: string;
  description: string;
  tags: string[];
  /** Optional screenshot in /public. */
  image?: string;
  github?: string;
  live?: string;
  /** Short label, e.g. "AI learning platform". */
  kind?: string;
  year?: string;
}

export interface TechCategory {
  title: string;
  items: string[];
}

export interface Experience {
  /** Role or qualification, e.g. "Backend Developer Intern". */
  title: string;
  organization?: string;
  /** Free text, e.g. "2024 – Present". */
  period: string;
  description: string;
  tags?: string[];
  bullets?: string[];
  type: "education" | "work";
}
