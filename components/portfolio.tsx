"use client";

import { Navbar } from "@/components/sections/navbar";
import { SpotlightHero } from "@/components/sections/hero";
import { TechMarquee } from "@/components/sections/tech-marquee";
import { AboutBento } from "@/components/sections/about-bento";
import { ProjectsSection } from "@/components/sections/projects";
import { ExperienceTimeline } from "@/components/sections/experience";
import { ContactSection } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";

export function Portfolio() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white antialiased">
      <Navbar />
      <SpotlightHero />
      <TechMarquee />
      <AboutBento />
      <ProjectsSection />
      <ExperienceTimeline />
      <ContactSection />
      <Footer />
    </main>
  );
}
