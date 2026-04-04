"use client";

import { useRef, useEffect } from "react";
import { ExternalLink, Github, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { projects } from "@/data/projects";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionBorder } from "@/components/ui/section-border";

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  /* Tilt + mouse-glow */
  useEffect(() => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;

    const onMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const nx = x / rect.width  - 0.5;
      const ny = y / rect.height - 0.5;

      gsap.to(card, { rotateY: nx * 7, rotateX: -ny * 7, duration: 0.35, ease: "power2.out", transformPerspective: 900 });
      gsap.to(glow, {
        opacity: 1,
        background: `radial-gradient(200px circle at ${x}px ${y}px, rgba(225,29,72,0.07), transparent 70%)`,
        duration: 0.2,
      });
    };
    const onLeave = () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
      gsap.to(glow, { opacity: 0, duration: 0.4 });
    };

    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", onLeave);
    return () => { card.removeEventListener("mousemove", onMove); card.removeEventListener("mouseleave", onLeave); };
  }, []);

  return (
    <div
      ref={cardRef}
      data-project-card
      className="group flex flex-col rounded-xl border border-rose-200 dark:border-rose-900/40
                 bg-[#FFE4E6] dark:bg-[#1a0509]
                 hover:border-rose-400/60 dark:hover:border-rose-700/60
                 hover:shadow-[0_0_0_1px_rgba(225,29,72,0.1),0_8px_32px_rgba(225,29,72,0.08)]
                 dark:hover:shadow-[0_0_0_1px_rgba(225,29,72,0.08),0_8px_32px_rgba(225,29,72,0.06)]
                 transition-[border-color,box-shadow] duration-300 overflow-hidden relative"
      style={{ opacity: 0 }}
    >
      {/* Mouse glow */}
      <div ref={glowRef} className="pointer-events-none absolute inset-0 rounded-xl opacity-0" />

      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-rose-100 dark:border-rose-900/30 relative z-10">
        <span className="text-sm font-semibold text-zinc-900 dark:text-white truncate group-hover:text-rose-700 dark:group-hover:text-rose-300 transition-colors duration-300">
          {project.title}
        </span>
        <div className="flex items-center gap-1 shrink-0 ml-3">
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} source`}
              className="p-1.5 rounded-lg text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-all hover:scale-110 active:scale-95">
              <Github className="w-3.5 h-3.5" />
            </a>
          )}
          {project.live && (
            <a href={project.live} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} live`}
              className="p-1.5 rounded-lg text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-all hover:scale-110 active:scale-95">
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 px-5 py-4 gap-4 relative z-10">
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed flex-1">{project.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-[11px] rounded-lg
                         bg-rose-100 dark:bg-[#2d0c12]
                         text-zinc-500 dark:text-zinc-400
                         border border-transparent
                         hover:border-rose-200 dark:hover:border-rose-800
                         hover:text-zinc-700 dark:hover:text-zinc-300
                         transition-all duration-200 cursor-default
                         hover:scale-105 inline-block"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProjectsSection() {
  const gridRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = document.querySelectorAll("[data-project-card]");
      if (cards.length) {
        ScrollTrigger.batch(cards, {
          start: "top 88%",
          onEnter(batch) {
            gsap.fromTo(batch,
              { opacity: 0, y: 32, filter: "blur(6px)" },
              { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6, stagger: 0.12, ease: "power3.out" }
            );
          },
          once: true,
        });
      }

      if (linkRef.current) {
        ScrollTrigger.create({
          trigger: linkRef.current,
          start: "top 92%",
          once: true,
          onEnter() {
            gsap.fromTo(linkRef.current,
              { opacity: 0, y: 12 },
              { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
            );
          },
        });
      }
    }, gridRef);
    return () => ctx.revert();
  }, []);

  return (
    <SectionBorder id="projects" coord="(2)" innerClassName="px-6 sm:px-10 py-16 md:py-24">
      <SectionHeader
        label="selected work"
        title={<>featured <span className="text-rose-600 dark:text-rose-400">projects</span></>}
        description="A selection of projects that showcase my expertise in building modern web applications and solving complex problems."
      />

      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" style={{ perspective: "1000px" }}>
        {projects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Link
          ref={linkRef}
          href="/work"
          className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                     border border-rose-200 dark:border-rose-900/40
                     text-sm text-zinc-500 dark:text-zinc-400
                     hover:text-zinc-900 dark:hover:text-white
                     hover:border-rose-400 dark:hover:border-rose-700
                     hover:bg-rose-50/50 dark:hover:bg-rose-900/10
                     transition-all duration-200"
          style={{ opacity: 0 }}
        >
          explore all projects
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </SectionBorder>
  );
}
