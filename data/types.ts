export interface Project {
    title: string;
    description: string;
    tags: string[];
    image: string;
    github?: string;
    live?: string;
}

export interface Technology {
    name: string;
    abbr: string;
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
