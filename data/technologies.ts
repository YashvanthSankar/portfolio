import { TechCategory } from "./types";

export const technologyCategories: TechCategory[] = [
    {
        title: "Languages",
        items: [
            { name: "JavaScript", icon: "javascript" },
            { name: "TypeScript", icon: "typescript" },
            { name: "Python", icon: "python" },
            { name: "C", icon: "c" },
            { name: "C++", icon: "cplusplus" },
            { name: "SQL", icon: "sql" },
            { name: "HTML5", icon: "html5" },
            { name: "CSS3", icon: "css3" },
        ],
    },
    {
        title: "Frontend",
        items: [
            { name: "React.js", icon: "react" },
            { name: "Next.js", icon: "nextdotjs" },
            { name: "Tailwind CSS", icon: "tailwindcss" },
            { name: "shadcn/ui", icon: "shadcnui" },
            { name: "Responsive Design", icon: "responsive" },
            { name: "SEO", icon: "seo" },
        ],
    },
    {
        title: "Backend",
        items: [
            { name: "Node.js", icon: "nodedotjs" },
            { name: "Express.js", icon: "express" },
            { name: "FastAPI", icon: "fastapi" },
            { name: "RESTful APIs", icon: "api" },
            { name: "Prisma ORM", icon: "prisma" },
            { name: "Authentication (JWT, OAuth)", icon: "auth" },
        ],
    },
    {
        title: "Databases",
        items: [
            { name: "PostgreSQL", icon: "postgresql" },
            { name: "MongoDB", icon: "mongodb" },
            { name: "MySQL", icon: "mysql" },
            { name: "Firebase", icon: "firebase" },
            { name: "Supabase", icon: "supabase" },
            { name: "Convex", icon: "convex" },
        ],
    },
    {
        title: "DevOps & Tools",
        items: [
            { name: "Git", icon: "git" },
            { name: "GitHub", icon: "github" },
            { name: "Docker", icon: "docker" },
            { name: "AWS Lambda", icon: "awslambda" },
            { name: "Redis", icon: "redis" },
            { name: "Vercel", icon: "vercel" },
            { name: "Netlify", icon: "netlify" },
            { name: "Postman", icon: "postman" },
            { name: "Figma", icon: "figma" },
            { name: "Linux", icon: "linux" },
        ],
    },
];
