"use client";
import dynamic from 'next/dynamic';
import { Navbar } from "@/components/sections/navbar";
import { SpotlightHero } from "@/components/sections/hero";

const skeleton = (h: string) => (
  <div className={`${h} bg-rose-100 dark:bg-[#2d0c12] animate-pulse`} />
);

const TechMarquee = dynamic(() => import("@/components/sections/tech-marquee").then(mod => ({ default: mod.TechMarquee })), {
  ssr: false,
  loading: () => skeleton("h-[400px]"),
});

const AboutBento = dynamic(() => import("@/components/sections/about-bento").then(mod => ({ default: mod.AboutBento })), {
  loading: () => skeleton("h-[500px]"),
});

const ProjectsSection = dynamic(() => import("@/components/sections/projects").then(mod => ({ default: mod.ProjectsSection })), {
  loading: () => skeleton("h-[600px]"),
});

const ExperienceTimeline = dynamic(() => import("@/components/sections/experience").then(mod => ({ default: mod.ExperienceTimeline })), {
  loading: () => skeleton("h-[600px]"),
});

const ContactSection = dynamic(() => import("@/components/sections/contact").then(mod => ({ default: mod.ContactSection })), {
  loading: () => skeleton("h-[450px]"),
});

const Footer = dynamic(() => import("@/components/sections/footer").then(mod => ({ default: mod.Footer })), {
  loading: () => skeleton("h-20"),
});

export function Portfolio() {
  return (
    <main id="main-content" className="relative min-h-screen antialiased">
      {/* Global grid background — shows through all transparent sections */}
      <div className="fixed inset-0 -z-10 bg-[#FFF1F2] dark:bg-[#0d0307]
        [background-image:linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)]
        dark:[background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]
        [background-size:48px_48px]" />
      <Navbar />
      <SpotlightHero />
      <div className="divide-y divide-dashed divide-rose-200 dark:divide-rose-900/40 border-b border-dashed border-rose-200 dark:border-rose-900/40">
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
