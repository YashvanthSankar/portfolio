import type { Project } from "./types";

export const projects: Project[] = [
  {
    title: "Project Doppler",
    kind: "Internship at Random Walk · computer vision",
    year: "2026",
    description:
      "Turns a monitor into a window. A webcam tracks the viewer's head with MediaPipe in a Web Worker, a One-Euro filter steadies it, and an off-axis projection re-renders a Gaussian-splat scene from their exact viewpoint. Photos become 3D scenes through Apple SHARP on a Modal GPU behind a FastAPI gateway.",
    tags: ["TypeScript", "Three.js", "WebGL", "MediaPipe", "Gaussian splatting", "FastAPI", "Modal", "Docker"],
    live: "https://doppel-rw.vercel.app",
  },
  {
    title: "GudTour",
    kind: "Mobile app · 2nd place, TravelTech, CS Week 2026",
    year: "2026",
    description:
      "Real-time, multilingual disaster alerts and verified emergency guidance for tourists in India, shipped as native Android and iOS apps from one Expo codebase. Official NDMA notices, community reports and a bounded LLM assessment stay on separate, versioned paths; 308 automated tests cover the Convex backend.",
    tags: ["Expo", "React Native", "TypeScript", "Convex", "Google Cloud Translation"],
    github: "https://github.com/YashvanthSankar/bits-n-bytes",
    live: "https://gudtour.zapdos.me",
  },
  {
    title: "choco.video",
    kind: "macOS app · open source",
    year: "2026",
    description:
      "A free macOS app that turns a podcast or talk into ranked, captioned, speaker-centred vertical clips without uploading anything. A Rust engine does transcription, clip scoring, face tracking and hardware rendering; a Tauri 2 and Svelte 5 shell wraps it in a 20 MB app with a custom minimal FFmpeg build.",
    tags: ["Rust", "Tauri 2", "Svelte 5", "whisper.cpp", "FFmpeg", "LLM"],
    github: "https://github.com/YashvanthSankar/choco.video",
    live: "https://chcvd.vercel.app",
  },
];
