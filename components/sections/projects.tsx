"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { DESKTOP_MOTION } from "@/lib/motion";
import { projects } from "@/data/projects";
import { chapterNumber } from "@/data/sections";
import type { Project } from "@/data/types";
import { SectionHeader } from "@/components/ui/section-header";
import { ProjectCover } from "@/components/ui/project-cover";
import { fadeUp, splitReveal } from "@/lib/split-reveal";

function ProjectPanel({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const num = String(index + 1).padStart(2, "0");

  useEffect(() => {
    const cleanups = [
      splitReveal(titleRef.current, {
        type: "lines",
        stagger: 0.07,
        start: "top 78%",
      }),
      fadeUp("[data-panel-meta]", {
        trigger: bodyRef.current,
        start: "top 78%",
        delay: 0.15,
        y: 18,
      }),
    ];
    return () => cleanups.forEach((fn) => fn());
  }, []);

  const href = project.live ?? project.github;

  const coverClass =
    "group relative block aspect-[16/11] overflow-hidden rounded-[var(--radius)] border border-[var(--line-1)] transition-[border-color,transform] duration-300 motion-safe:active:scale-[0.985] md:absolute md:inset-0 md:aspect-auto md:rounded-none md:border-0";

  /* Desktop: the cover is the whole panel, full-bleed, and the copy sits
     over it on a gradient — a title card, not a card in a grid. Phones
     keep the stacked layout: copy, then a cover at its own proportions. */
  return (
    <article
      data-work-panel
      className="md:sticky md:top-0"
      style={{ zIndex: index + 1 }}
    >
      <div className="relative border-t border-[var(--line-1)] bg-[var(--bg-0)] md:min-h-[100svh] md:origin-top md:overflow-hidden">
        {/* Cover */}
        <div className="px-[var(--gutter)] pt-16 md:absolute md:inset-0 md:p-0">
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="view"
              className={`${coverClass} hover:border-[var(--line-2)]`}
            >
              {/* Names the link from its content, so the visible plate text
                  is part of the accessible name rather than overridden. */}
              <span className="sr-only">{project.title} — open project: </span>
              <ProjectCover project={project} index={index} />
            </a>
          ) : (
            <div className={coverClass}>
              <ProjectCover project={project} index={index} />
            </div>
          )}
          {/* Legibility scrim for the copy, desktop only */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,var(--bg-0)_0%,rgba(10,10,11,0.86)_34%,rgba(10,10,11,0.2)_70%,transparent_100%)] md:block"
          />
        </div>

        <div className="pointer-events-none relative mx-auto flex max-w-[var(--container)] flex-col px-[var(--gutter)] pb-16 pt-10 md:min-h-[100svh] md:justify-end md:pb-20 md:pt-28">
          {/* Text column */}
          <div ref={bodyRef} className="pointer-events-auto md:max-w-xl">
            <div data-panel-meta className="mb-6 flex items-center gap-3" style={{ opacity: 0 }}>
              <span className="meta text-[var(--accent)]">{num}</span>
              <span className="h-px w-8 bg-[var(--line-2)]" />
              <span className="meta">{project.kind ?? project.tags[0]}</span>
              {project.year && <span className="meta">· {project.year}</span>}
            </div>

            <h3 ref={titleRef} className="display-lg mb-6">
              {project.title}
            </h3>

            <div data-panel-meta style={{ opacity: 0 }}>
              <p className="lead mb-8 max-w-md text-[var(--text-2)]">
                {project.description}
              </p>

              <ul className="mb-9 flex flex-wrap gap-x-5 gap-y-2">
                {project.tags.map((tag) => (
                  <li key={tag} className="meta text-[var(--text-2)]">
                    {tag}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center gap-3">
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline"
                  >
                    Visit live
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-ghost"
                  >
                    <Github className="h-3.5 w-3.5" />
                    Source
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function SelectedWork() {
  const stackRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  /* Outgoing panels recede as the next one slides over them, and the rail
     in the corner counts the stack through. */
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(DESKTOP_MOTION, () => {
      const panels = gsap.utils.toArray<HTMLElement>("[data-work-panel]", stackRef.current);

      panels.forEach((panel, i) => {
        const next = panels[i + 1];
        if (!next) return;
        gsap.to(panel.firstElementChild, {
          scale: 0.955,
          opacity: 0.45,
          ease: "none",
          scrollTrigger: {
            trigger: next,
            start: "top bottom",
            end: "top top",
            scrub: 0.5,
          },
        });
      });

      gsap.set(fillRef.current, { scaleX: 0 });
      ScrollTrigger.create({
        trigger: stackRef.current,
        start: "top 60%",
        end: "bottom 40%",
        onToggle(self) {
          gsap.to(railRef.current, { autoAlpha: self.isActive ? 1 : 0, duration: 0.4 });
        },
        onUpdate(self) {
          gsap.set(fillRef.current, { scaleX: self.progress });
          const n = Math.min(panels.length, Math.floor(self.progress * panels.length) + 1);
          /* Static text React never re-renders, so writing it directly is safe. */
          if (countRef.current) countRef.current.textContent = String(n).padStart(2, "0");
        },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="projects" className="relative z-10 bg-[var(--bg-0)]">
      {/* Progress rail — desktop only, where the panels stack */}
      <div
        ref={railRef}
        aria-hidden="true"
        className="pointer-events-none fixed bottom-8 left-[var(--gutter)] z-30 hidden items-center gap-3 md:flex"
        style={{ opacity: 0 }}
      >
        <span className="meta tabular-nums text-[var(--text-1)]">
          <span ref={countRef}>01</span>
          <span className="text-[var(--text-3)]">
            {" "}
            / {String(projects.length).padStart(2, "0")}
          </span>
        </span>
        <span className="block h-px w-16 overflow-hidden bg-[var(--line-2)]">
          <span ref={fillRef} className="block h-full w-full origin-left bg-[var(--accent)]" />
        </span>
      </div>

      <div className="mx-auto max-w-[var(--container)] px-[var(--gutter)] pt-[var(--section-pad)]">
        <SectionHeader
          index={chapterNumber("projects")}
          label="selected work"
          title={
            <>
              Things I&apos;ve shipped, and{" "}
              <span className="serif-accent">why they matter</span>.
            </>
          }
          description="A few projects worth showing in full. Everything else lives on GitHub."
        />
      </div>

      <div ref={stackRef} className="relative">
        {projects.map((project, i) => (
          <ProjectPanel key={project.title} project={project} index={i} />
        ))}
      </div>

      <div className="relative z-20 border-t border-[var(--line-1)] bg-[var(--bg-0)]">
        <div className="mx-auto flex max-w-[var(--container)] flex-wrap items-center justify-between gap-6 px-[var(--gutter)] py-14">
          <p className="lead max-w-sm">
            Thirty-odd public repositories — tools, experiments, and things built to
            scratch an itch.
          </p>
          <Link href="/work" className="btn btn-outline">
            Browse all projects
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
