import { Navbar } from "@/components/sections/navbar";
import { SpotlightHero } from "@/components/sections/hero";
import { NowSection } from "@/components/sections/now";
import { TechMarquee } from "@/components/sections/tech-marquee";
import { AboutBento } from "@/components/sections/about-bento";
import { ProjectsSection } from "@/components/sections/projects";
import { ExperienceTimeline } from "@/components/sections/experience";
import { ContactSection } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";

export function Portfolio() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <SpotlightHero />
        <NowSection />
        <TechMarquee />
        <AboutBento />
        <ProjectsSection />
        <ExperienceTimeline />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
