import type { Project } from "./types";

export const projects: Project[] = [
  {
    title: "PrepLoot",
    kind: "AI learning platform",
    year: "2025",
    description:
      "Recommends the best YouTube lectures for any subject, then generates quizzes, notes and games from that content — so students preparing for JEE, NEET, GATE and UPSC learn while they watch.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Prisma"],
    image: "/preploot.png",
    github: "https://github.com/YashvanthSankar/preploot",
    live: "https://preploot.vercel.app",
  },
  {
    title: "QwikRead AI",
    kind: "Browser extension",
    year: "2025",
    description:
      "A Chrome extension that summarises any article in one click. Built around Gemini with a deliberately tiny surface: no account, no sidebar, no friction.",
    tags: ["Chrome Extensions API", "Google Gemini", "JavaScript", "CSS"],
    github: "https://github.com/YashvanthSankar/qwikread-ai-extension",
    live: "https://qwikread.vercel.app",
  },
  {
    title: "ER Forms Autofiller",
    kind: "Healthcare automation",
    year: "2024",
    description:
      "A Python tool that fills government-mandated patient admission forms straight from hospital CSV records. Built for an emergency room drowning in manual data entry — hours of typing collapsed into one command.",
    tags: ["Python", "Selenium", "Pandas"],
    github: "https://github.com/YashvanthSankar/hospital-er-forms-autofiller",
  },
];
