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
      
      {/* Unified Background Container for all sections after hero */}
      <div className="relative overflow-hidden">
        {/* Unified Premium Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Multiple Animated gradient orbs - strategically placed */}
          <div className="absolute top-[5%] right-1/4 w-[600px] h-[600px] bg-blue-500/12 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-[20%] left-1/4 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.2s' }} />
          <div className="absolute top-[40%] right-1/3 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.6s' }} />
          <div className="absolute top-[55%] left-1/3 w-[550px] h-[550px] bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.8s' }} />
          <div className="absolute top-[75%] right-1/4 w-[480px] h-[480px] bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2.4s' }} />
          <div className="absolute top-[90%] left-1/4 w-[400px] h-[400px] bg-violet-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />
          
          {/* Layered Radial gradients for depth */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(59,130,246,0.08),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_30%_30%,rgba(139,92,246,0.06),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_70%_60%,rgba(16,185,129,0.05),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_100%,rgba(6,182,212,0.06),transparent)]" />
          
          {/* Diagonal gradient sweeps for dynamic feel */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-violet-500/5" />
          <div className="absolute inset-0 bg-gradient-to-tl from-emerald-500/5 via-transparent to-cyan-500/5" />
          
          {/* Multi-layered grid patterns */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:128px_128px] [mask-image:radial-gradient(ellipse_at_50%_30%,black_20%,transparent_70%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.02)_1px,transparent_1px)] bg-[size:96px_96px] [mask-image:radial-gradient(ellipse_at_50%_70%,black_30%,transparent_80%)]" />
          
          {/* Dot pattern for texture */}
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[size:32px_32px]" />
          
          {/* Animated noise texture */}
          <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]" />
          
          {/* Scanlines for premium tech aesthetic */}
          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(255,255,255,0.015)_50%)] bg-[size:100%_4px]" />
          
          {/* Vignette effect */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
          
          {/* Subtle cross-hatch pattern for depth */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_48%,rgba(255,255,255,0.03)_49%,rgba(255,255,255,0.03)_51%,transparent_52%),linear-gradient(-45deg,transparent_48%,rgba(255,255,255,0.03)_49%,rgba(255,255,255,0.03)_51%,transparent_52%)] bg-[size:32px_32px]" />
        </div>

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