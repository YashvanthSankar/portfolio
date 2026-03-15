"use client";
import dynamic from 'next/dynamic';
import { Navbar } from "@/components/sections/navbar";
import { SpotlightHero } from "@/components/sections/hero";

const TechMarquee = dynamic(() => import("@/components/sections/tech-marquee").then(mod => ({ default: mod.TechMarquee })), {
  ssr: false,
  loading: () => <div className="h-24" />
});

const AboutBento = dynamic(() => import("@/components/sections/about-bento").then(mod => ({ default: mod.AboutBento })), {
  loading: () => <div className="h-96 animate-pulse" />
});

const ProjectsSection = dynamic(() => import("@/components/sections/projects").then(mod => ({ default: mod.ProjectsSection })), {
  loading: () => <div className="h-[600px] animate-pulse" />
});

const ExperienceTimeline = dynamic(() => import("@/components/sections/experience").then(mod => ({ default: mod.ExperienceTimeline })), {
  loading: () => <div className="h-[600px] animate-pulse" />
});

const ContactSection = dynamic(() => import("@/components/sections/contact").then(mod => ({ default: mod.ContactSection })), {
  loading: () => <div className="h-[400px] animate-pulse" />
});

const Footer = dynamic(() => import("@/components/sections/footer").then(mod => ({ default: mod.Footer })), {
  loading: () => <div className="h-20 animate-pulse" />
});

export function Portfolio() {
  return (
    <main id="main-content" className="relative min-h-screen antialiased">
      {/* Global grid background — shows through all transparent sections */}
      <div className="fixed inset-0 -z-10 bg-white dark:bg-zinc-950
        [background-image:linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)]
        dark:[background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)]
        [background-size:48px_48px]" />
      <Navbar />
      <SpotlightHero />
      <div className="divide-y divide-zinc-200 dark:divide-zinc-800 border-b border-zinc-200 dark:border-zinc-800">
        <TechMarquee />
        <AboutBento />
        <ProjectsSection />
        <ExperienceTimeline />
        <ContactSection />
        <Footer />
      </div>
    </main>
  );
}
