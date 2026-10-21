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
    period: "Feb – Sep 2026",
    title: "Founding Engineer",
    organization: "Promptli · Toronto, remote",
    description:
      "Built a voice-AI receptionist on LiveKit Agents and the OpenAI Realtime API handling inbound and outbound calls over Twilio SIP, with 14 function-calling tools wired into self-hosted Cal.com and a 21-table Convex data layer.",
    tags: ["LiveKit", "OpenAI Realtime", "Twilio SIP", "Convex", "AWS Lightsail", "Docker"],
  },
  {
    type: "work",
    period: "Jan – Feb 2026",
    title: "Software Developer Intern",
    organization: "Artly Creative Labs · ReelCat",
    description:
      "Built ReelCat, a video-editing SaaS: a serverless render pipeline on Remotion and AWS Lambda that cut render time by 60%, plus auth, payments, analytics and real-time sync on Convex.",
    tags: ["React", "Remotion", "AWS Lambda", "Convex", "Expo"],
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
