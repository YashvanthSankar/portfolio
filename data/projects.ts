import type { Project } from "./types";

export const projects: Project[] = [
  {
    title: "PrepLoot",
    kind: "AI Learning Platform",
    year: "2025",
    description:
      "An AI-powered learning platform that recommends the best YouTube lectures for any subject, then generates quizzes, notes, and interactive games from that content — so students preparing for JEE, NEET, GATE, and UPSC learn while they watch.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Prisma"],
    github: "https://github.com/YashvanthSankar/preploot",
    live: "https://preploot.vercel.app",
  },
  {
    title: "QwikRead AI",
    kind: "Browser Extension",
    year: "2025",
    description:
      "A lightweight Chrome extension that summarizes any article in one click. Built around Gemini with a deliberately tiny surface area — no account, no sidebar, no friction.",
    tags: ["Chrome Extensions API", "Google Gemini", "JavaScript", "CSS"],
    github: "https://github.com/YashvanthSankar/qwikread-ai-extension",
    live: "https://qwikread.vercel.app",
  },
  {
    title: "ER Forms Autofiller",
    kind: "Healthcare Automation",
    year: "2024",
    description:
      "A Python tool that fills government-mandated patient admission forms straight from hospital CSV records. Built for an emergency room drowning in manual data entry — hours of typing collapsed into a single command.",
    tags: ["Python", "Selenium", "Pandas", "Automation"],
    github: "https://github.com/YashvanthSankar/hospital-er-forms-autofiller",
  },
];
