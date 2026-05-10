"use client";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/sections/navbar";
import { SpotlightHero } from "@/components/sections/hero";
import { ScrollProgressBar } from "@/components/sections/footer";
import { SectionIndex } from "@/components/section-index";
import { KbdShortcuts } from "@/components/kbd-shortcuts";

const skeleton = (h: string) => (
  <div
    className={`${h} border-t-[2.5px] border-[var(--border-ink)] bg-[var(--surface)] animate-pulse`}
  />
);

const NowSection = dynamic(
  () => import("@/components/sections/now").then((m) => ({ default: m.NowSection })),
  { loading: () => skeleton("h-[400px]") }
);
const TechMarquee = dynamic(
  () => import("@/components/sections/tech-marquee").then((m) => ({ default: m.TechMarquee })),
  { ssr: false, loading: () => skeleton("h-[420px]") }
);
const AboutBento = dynamic(
  () => import("@/components/sections/about-bento").then((m) => ({ default: m.AboutBento })),
  { loading: () => skeleton("h-[600px]") }
);
const ProjectsSection = dynamic(
  () => import("@/components/sections/projects").then((m) => ({ default: m.ProjectsSection })),
  { loading: () => skeleton("h-[700px]") }
);
const ExperienceTimeline = dynamic(
  () => import("@/components/sections/experience").then((m) => ({ default: m.ExperienceTimeline })),
  { loading: () => skeleton("h-[700px]") }
);
const ContactSection = dynamic(
  () => import("@/components/sections/contact").then((m) => ({ default: m.ContactSection })),
  { loading: () => skeleton("h-[500px]") }
);
const Footer = dynamic(
  () => import("@/components/sections/footer").then((m) => ({ default: m.Footer })),
  { loading: () => skeleton("h-24") }
);

export function Portfolio() {
  return (
    <main id="main-content" className="relative min-h-screen">
      <ScrollProgressBar />
      <SectionIndex />
      <KbdShortcuts />
      {/* Global brutalist grid background */}
      <div className="fixed inset-0 -z-10 bg-brutal-grid" aria-hidden="true" />

      <Navbar />
      <SpotlightHero />
      <NowSection />
      <TechMarquee />
      <AboutBento />
      <ProjectsSection />
      <ExperienceTimeline />
      <ContactSection />
      <Footer />
    </main>
  );
}
