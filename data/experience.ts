import type { Experience } from "./types";

export const experience: Experience[] = [
  {
    type: "work",
    period: "Jun – Aug 2026",
    title: "Artificial Intelligence Intern",
    organization: "Random Walk · Chennai",
    description:
      "Built Project Doppler: a head-tracked display that re-renders a Gaussian-splat scene from the viewer's position, with a photo-to-3D pipeline on a Modal GPU.",
    tags: ["TypeScript", "Three.js", "MediaPipe", "FastAPI", "Docker"],
  },
  {
    type: "work",
    period: "Feb – Oct 2026",
    title: "Founding Engineer",
    organization: "Promptli · Toronto, remote",
    description:
      "Part-time founding engineer on promptli.com, voice AI agents for lead capture. Built the conversion surface and the internal issue tracker.",
    tags: ["Next.js", "TypeScript", "Voice AI"],
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
    type: "education",
    period: "2024 – 2029",
    title: "BTech + MTech in Computer Science",
    organization: "IIITDM Kancheepuram",
    description:
      "Integrated dual degree with a focus on software engineering, AI/ML and full-stack development. CGPA 9.27.",
  },
];
