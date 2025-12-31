import { Experience } from "./types";

export const experience: Experience[] = [
    {
        type: "education",
        period: "2024-2029",
        title: "BTech + MTech in Computer Science",
        organization: "IIITDM Kancheepuram",
        description:
            "Pursuing an integrated dual degree program (2024-2029) with a focus on software engineering, AI/ML, and full-stack development.",
        bullets: [
            "Specialized in Machine Learning and Web Technologies",
            "Active member of the college coding club",
            "Participated in multiple hackathons and coding competitions",
        ],
    },
    {
        type: "work",
        period: "2025",
        title: "Backend Developer Intern",
        organization: "reel.cat",
        description:
            "Part of the video and audio processing team, building scalable backend infrastructure for media handling and processing pipelines.",
        tags: ["Docker", "Remotion", "Convex"],
    },
    {
        type: "work",
        period: "2025",
        title: "Web Developer Intern",
        organization: "Tech Affairs & E-Cell, IIITDM Kancheepuram",
        description:
            "Developed the official website for the Tech Affairs and Entrepreneurship Cell, creating a modern web presence for the institution.",
        tags: ["Next.js", "React", "Tailwind CSS"],
    },
];
