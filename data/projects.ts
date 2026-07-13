import { Project } from "./types";

export const projects: Project[] = [
    {
        title: "PrepLoot",
        description:
            "An AI-powered learning platform that recommends top YouTube videos for any subject and automatically generates quizzes, notes, and interactive games from the content, so students can watch and learn at the same time while preparing for competitive exams like JEE, NEET, GATE, and UPSC.",
        tags: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Prisma"],
        github: "https://github.com/YashvanthSankar/preploot",
        live: "https://preploot.vercel.app",
    },
    {
        title: "QwikRead AI",
        description:
            "A lightweight, AI-powered Chrome extension that instantly summarizes articles with a single click.",
        tags: ["Chrome Extensions API", "Google Gemini", "HTML", "CSS", "JavaScript"],
        github: "https://github.com/YashvanthSankar/qwikread-ai-extension",
        live: "https://qwikread.vercel.app",
    },
    {
        title: "Hospital ER Forms Autofiller",
        description:
            "A Python tool to auto-fill government-mandated patient admission Google Forms from hospital records (CSV).",
        tags: ["Python", "Selenium", "Pandas", "Webdriver manager"],
        github: "https://github.com/YashvanthSankar/hospital-er-forms-autofiller",
    },
];
