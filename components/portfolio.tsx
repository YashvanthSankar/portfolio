"use client";
import dynamic from 'next/dynamic';
import { Navbar } from "@/components/sections/navbar";
import { SpotlightHero } from "@/components/sections/hero";
import { PortfolioBackground } from "@/components/ui/portfolio-background";

// Lazy load sections that are not immediately visible
const TechMarquee = dynamic(() => import("@/components/sections/tech-marquee").then(mod => ({ default: mod.TechMarquee })), {
  loading: () => <div className="h-32 bg-zinc-950 animate-pulse" />
});

const AboutBento = dynamic(() => import("@/components/sections/about-bento").then(mod => ({ default: mod.AboutBento })), {
  loading: () => <div className="h-96 bg-zinc-950 animate-pulse" />
});

const ProjectsSection = dynamic(() => import("@/components/sections/projects").then(mod => ({ default: mod.ProjectsSection })), {
  loading: () => <div className="h-[800px] bg-zinc-950 animate-pulse" />
});

const ExperienceTimeline = dynamic(() => import("@/components/sections/experience").then(mod => ({ default: mod.ExperienceTimeline })), {
  loading: () => <div className="h-[600px] bg-zinc-950 animate-pulse" />
});

const ContactSection = dynamic(() => import("@/components/sections/contact").then(mod => ({ default: mod.ContactSection })), {
  loading: () => <div className="h-[400px] bg-zinc-950 animate-pulse" />
});

const Footer = dynamic(() => import("@/components/sections/footer").then(mod => ({ default: mod.Footer })), {
  loading: () => <div className="h-64 bg-zinc-950 animate-pulse" />
});

export function Portfolio() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white antialiased">
      <Navbar />
      <SpotlightHero />

      {/* Unified Background Container for all sections after hero */}
      <div className="relative overflow-hidden">
        <PortfolioBackground />

        {/* All sections with relative positioning */}
        <div className="relative z-10">
          <TechMarquee />
          <AboutBento />
          <ProjectsSection />
          <ExperienceTimeline />
          <ContactSection />
          <Footer />
        </div>
      </div>
    </main>
  );
}