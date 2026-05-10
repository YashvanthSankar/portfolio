"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { ExternalLink, Github, ArrowUpRight } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { shouldAnimate } from "@/lib/utils";
import { projects } from "@/data/projects";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionBorder } from "@/components/ui/section-border";
import { BrutalButton, BrutalTag } from "@/components/ui/brutal";

function ProjectCard({ project, index }: { project: (typeof projects)[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const [imgOk, setImgOk] = useState(true);
  const num = String(index + 1).padStart(2, "0");

  // Pull the host out of live URL for the browser-chrome bar
  const host = project.live
    ? (() => {
        try {
          return new URL(project.live).host;
        } catch {
          return "preview";
        }
      })()
    : "local";

  return (
    <article
      data-project-card
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className="group relative flex flex-col bg-[var(--surface)] border-[2.5px] border-[var(--border-ink)] shadow-brutal brutal-card-hover overflow-hidden"
      style={{ opacity: 0 }}
    >
      {/* Number — hangs above as a sticker */}
      <div className="absolute -top-3 -left-3 z-20 inline-flex items-center justify-center w-12 h-12 border-[2.5px] border-[var(--border-ink)] bg-[var(--ink)] text-[var(--paper)] shadow-[3px_3px_0_0_var(--border-ink)] font-display font-bold text-base -rotate-3">
        {num}
      </div>

      {/* Browser-chrome preview pane */}
      <div className="relative border-b-[2.5px] border-[var(--border-ink)] bg-[var(--surface-alt)]">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-3 py-2 border-b-2 border-[var(--border-ink)] bg-[var(--paper)]">
          <span className="flex gap-1.5">
            <span className="w-2.5 h-2.5 border-2 border-[var(--border-ink)] bg-[var(--paper)]" />
            <span className="w-2.5 h-2.5 border-2 border-[var(--border-ink)] bg-[var(--paper)]" />
            <span className="w-2.5 h-2.5 border-2 border-[var(--border-ink)] bg-[var(--paper)]" />
          </span>
          <span className="ml-2 flex-1 truncate font-mono text-[10px] font-bold tracking-wide text-[var(--muted)]">
            {host}
          </span>
        </div>

        {/* Preview surface */}
        <div className="relative h-44 md:h-52 overflow-hidden">
          {project.image && imgOk ? (
            <Image
              src={project.image}
              alt={`${project.title} preview`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className={`object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                hovered ? "scale-[1.06]" : "scale-100"
              }`}
              onError={() => setImgOk(false)}
            />
          ) : (
            // Type-led fallback — looks intentional, not "missing image"
            <div className="absolute inset-0 flex flex-col justify-between p-5 bg-[var(--surface-alt)]">
              <span className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-[var(--muted)]">
                {project.tags[0] ?? "Project"}
              </span>
              <h4
                className={`font-display font-bold leading-[0.95] tracking-[-0.04em] text-[var(--ink)] transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                  hovered ? "-translate-y-0.5" : ""
                }`}
                style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)" }}
              >
                {project.title}
              </h4>
              <div className="flex items-end justify-between gap-3">
                <span className="font-mono text-[10px] text-[var(--muted)]">{`// ${num}`}</span>
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--ink)]">
                  {project.live ? "live" : "local"}
                </span>
              </div>
            </div>
          )}

          {/* Hover overlay — appears as a translucent ink wash with a CTA */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-out ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden="true"
          >
            <span className="absolute inset-0 bg-[var(--ink)]/55" />
            <span
              className={`relative inline-flex items-center gap-2 px-4 py-2 border-[2.5px] border-[var(--paper)] bg-[var(--ink)] text-[var(--paper)] font-display font-bold text-sm tracking-wide shadow-[4px_4px_0_0_var(--paper)] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                hovered ? "translate-y-0" : "translate-y-2"
              }`}
            >
              {project.live ? "Visit live" : project.github ? "View source" : "Open project"}
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>

          {/* Click-through links overlaying the preview */}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} live site`}
              className="absolute inset-0 z-10"
            />
          )}
          {!project.live && project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} on GitHub`}
              className="absolute inset-0 z-10"
            />
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 gap-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display font-bold text-base md:text-lg text-[var(--ink)] leading-tight">
            {project.title}
          </h3>
          <div className="flex items-center gap-1.5 shrink-0">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} on GitHub`}
                className="inline-flex items-center justify-center w-8 h-8 border-2 border-[var(--border-ink)] bg-[var(--paper)] text-[var(--ink)] shadow-[2px_2px_0_0_var(--border-ink)] transition-[transform,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[4px_4px_0_0_var(--border-ink)] hover:bg-[var(--surface-alt)]"
                onClick={(e) => e.stopPropagation()}
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
                className="inline-flex items-center justify-center w-8 h-8 border-2 border-[var(--border-ink)] bg-[var(--paper)] text-[var(--ink)] shadow-[2px_2px_0_0_var(--border-ink)] transition-[transform,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[4px_4px_0_0_var(--border-ink)] hover:bg-[var(--surface-alt)]"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        <p className="text-sm text-[var(--ink)] leading-[1.6] flex-1">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 pt-2 border-t-2 border-dashed border-[var(--border-ink)]/30">
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
        description="Things I've shipped — across web apps, AI tooling, and quiet automation."
      />

      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        {projects.map((project, i) => (
          <ProjectCard key={project.title} project={project} index={i} />
        ))}
      </div>

      <div className="mt-14 flex justify-center">
        <BrutalButton as="link" href="/work" variant="ink" size="lg">
          Explore all projects
          <ArrowUpRight className="w-4 h-4" />
        </BrutalButton>
      </div>
    </SectionBorder>
  );
}
