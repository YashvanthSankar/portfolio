import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Hero } from "@/components/sections/hero";
import { Work } from "@/components/sections/work";
import { Now } from "@/components/sections/now";
import { Activity } from "@/components/sections/activity";
import { ExperienceSection } from "@/components/sections/experience";
import { Achievements } from "@/components/sections/achievements";
import { About } from "@/components/sections/about";
import { Stack } from "@/components/sections/stack";
import { ContactSection } from "@/components/sections/contact";

/* The Activity section reads GitHub; rebuild the page at most hourly. */
export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <Hero />
        <Work />
        <ExperienceSection />
        <Achievements />
        <Now />
        <Activity />
        <About />
        <Stack />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}
