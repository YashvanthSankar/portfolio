"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { SelectedWork } from "@/components/sections/projects";
import { ScrollProgressBar } from "@/components/sections/footer";
import { SectionIndex } from "@/components/section-index";
import { KbdShortcuts } from "@/components/kbd-shortcuts";
import { MobileProgress } from "@/components/mobile-progress";
import { ScrollTrigger } from "@/lib/gsap";

/**
 * Skeletons carry the same min-height as the real section so swapping a
 * dynamic chunk in doesn't shift layout under ScrollTrigger's measurements.
 */
const skeleton = (minHeight: number) => (
  <div
    style={{ minHeight }}
    className="border-t border-[var(--line-1)] bg-[var(--bg-0)]"
  />
);

const About = dynamic(
  () => import("@/components/sections/about").then((m) => ({ default: m.About })),
  { loading: () => skeleton(900) }
);
const ExperienceSection = dynamic(
  () =>
    import("@/components/sections/experience").then((m) => ({
      default: m.ExperienceSection,
    })),
  { loading: () => skeleton(700) }
);
const NowSection = dynamic(
  () => import("@/components/sections/now").then((m) => ({ default: m.NowSection })),
  { loading: () => skeleton(560) }
);
const Stack = dynamic(
  () => import("@/components/sections/stack").then((m) => ({ default: m.Stack })),
  { loading: () => skeleton(800) }
);
const ContactSection = dynamic(
  () =>
    import("@/components/sections/contact").then((m) => ({ default: m.ContactSection })),
  { loading: () => skeleton(760) }
);
const Footer = dynamic(
  () => import("@/components/sections/footer").then((m) => ({ default: m.Footer })),
  { loading: () => skeleton(600) }
);

export function Portfolio() {
  /* Late-arriving chunks change document height; one debounced refresh
     keeps every trigger's start/end honest. */
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <>
      <ScrollProgressBar />
      <Navbar />
      <SectionIndex />
      <MobileProgress />
      <KbdShortcuts />

      <main id="main-content" className="relative">
        {/* Hero stays pinned at z-0 while the content below scrolls over it */}
        <Hero />

        <div className="relative z-10">
          <SelectedWork />
          <About />
          <ExperienceSection />
          <NowSection />
          <Stack />
          <ContactSection />
          <Footer />
        </div>
      </main>
    </>
  );
}
