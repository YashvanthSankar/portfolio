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
    title: string; // e.g., "2024-2029" or "Backend Developer Intern"
    organization?: string;
    period: string;
    description: string;
    tags?: string[];
    role?: string; // For the detailed view
    type: "education" | "work";
    bullets?: string[]; // For bullet points
}
