import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Hero } from "@/components/sections/hero";
import { Work } from "@/components/sections/work";
import { Now } from "@/components/sections/now";
import { ExperienceSection } from "@/components/sections/experience";
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
        <Now />
        <About />
        <Stack />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}
