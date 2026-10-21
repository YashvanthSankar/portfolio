import type { TechCategory } from "./types";

export const technologyCategories: TechCategory[] = [
  {
    title: "Languages",
    items: ["JavaScript", "TypeScript", "Python", "C", "C++", "SQL", "HTML", "CSS"],
  },
  {
    title: "Frontend",
    items: ["React", "Next.js", "Tailwind CSS", "shadcn/ui"],
  },
  {
    title: "Backend",
    items: ["Node.js", "Express", "FastAPI", "REST APIs", "Prisma", "Auth (JWT, OAuth)"],
  },
  {
    title: "Databases",
    items: ["PostgreSQL", "MongoDB", "MySQL", "Firebase", "Supabase", "Convex"],
  },
  {
    title: "Tools",
    items: ["Git", "GitHub", "Docker", "AWS Lambda", "Redis", "Vercel", "Netlify", "Postman", "Figma", "Linux"],
  },
];
