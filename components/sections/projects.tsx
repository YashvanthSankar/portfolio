"use client";

import { useRef, useEffect } from "react";
import { ExternalLink, Github, ArrowUpRight } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { shouldAnimate } from "@/lib/utils";
import { projects } from "@/data/projects";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionBorder } from "@/components/ui/section-border";
import { BrutalButton, BrutalTag } from "@/components/ui/brutal";

/* Card header variants — 3 editorial looks with guaranteed contrast.
   Number-badge always uses paper bg + ink text to stay legible on any header. */
const cardAccents = [
  { header: "bg-[var(--accent)] text-[var(--accent-ink)]", number: "bg-[var(--paper)] text-[var(--ink)]" },
  { header: "bg-[var(--ink)] text-[var(--paper)]", number: "bg-[var(--paper)] text-[var(--ink)]" },
  { header: "bg-[var(--surface-alt)] text-[var(--ink)]", number: "bg-[var(--paper)] text-[var(--ink)]" },
];

function ProjectCard({ project, index }: { project: (typeof projects)[0]; index: number }) {
  const accent = cardAccents[index % cardAccents.length];

  return (
    <article
      data-project-card
      className="group flex flex-col bg-[var(--surface)] border-[2.5px] border-[var(--border-ink)] shadow-brutal brutal-card-hover"
      style={{ opacity: 0 }}
    >
      {/* Top colored header bar */}
      <div className={`flex items-center justify-between px-5 py-3 border-b-[2.5px] border-[var(--border-ink)] ${accent.header}`}>
        <div className="flex items-center gap-3 min-w-0">
          <span className={`inline-flex items-center justify-center w-7 h-7 border-2 border-[var(--border-ink)] font-display font-bold text-xs shrink-0 ${accent.number}`}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="font-display font-bold text-base md:text-lg truncate">{project.title}</h3>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} on GitHub`}
              className="inline-flex items-center justify-center w-8 h-8 border-2 border-[var(--border-ink)] bg-[var(--paper)] text-[var(--ink)] shadow-[2px_2px_0_0_var(--border-ink)] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[3px_3px_0_0_var(--border-ink)] transition-transform duration-150"
            >
              <Github className="w-4 h-4" />
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} live site`}
              className="inline-flex items-center justify-center w-8 h-8 border-2 border-[var(--border-ink)] bg-[var(--paper)] text-[var(--ink)] shadow-[2px_2px_0_0_var(--border-ink)] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[3px_3px_0_0_var(--border-ink)] transition-transform duration-150"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 gap-5">
        <p className="text-sm md:text-base text-[var(--ink)] leading-[1.65] flex-1">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <BrutalTag key={tag}>{tag}</BrutalTag>
          ))}
        </div>
      </div>
    </article>
  );
}

export function ProjectsSection() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!shouldAnimate()) return;
    const ctx = gsap.context(() => {
      const cards = document.querySelectorAll<HTMLElement>("[data-project-card]");
      if (cards.length) {
        ScrollTrigger.batch(cards, {
          start: "top 88%",
          onEnter(batch) {
            gsap.fromTo(
              batch,
              { opacity: 0, y: 40 },
              { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: "power3.out" }
            );
          },
          once: true,
        });
      }
    }, gridRef);
    return () => ctx.revert();
  }, []);

  return (
    <SectionBorder id="projects" label="// work" innerClassName="px-6 sm:px-10 py-16 md:py-24">
      <SectionHeader
        label="selected work"
        title={
          <>
            Featured{" "}
            <span className="inline-block bg-[var(--accent)] text-[var(--accent-ink)] border-[3px] border-[var(--border-ink)] px-3 shadow-[6px_6px_0_0_var(--border-ink)] rotate-1">
              projects.
            </span>
          </>
        }
        description="Projects that showcase my expertise across web apps, AI tooling, and automation."
      />

      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((project, i) => (
          <ProjectCard key={project.title} project={project} index={i} />
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <BrutalButton as="link" href="/work" variant="ink" size="lg">
          Explore all projects
          <ArrowUpRight className="w-4 h-4" />
        </BrutalButton>
      </div>
    </SectionBorder>
  );
}
