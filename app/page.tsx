import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Hero } from "@/components/sections/hero";
import { Work } from "@/components/sections/work";
import { ExperienceSection } from "@/components/sections/experience";
import { Achievements } from "@/components/sections/achievements";
import { About } from "@/components/sections/about";
import { Stack } from "@/components/sections/stack";
import { ContactSection } from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <Hero />
        <Work />
        <ExperienceSection />
        <Achievements />
        <About />
        <Stack />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}
