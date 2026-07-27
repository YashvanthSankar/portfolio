"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { projects } from "@/data/projects";
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

  return (
    <article
      data-work-panel
      className="md:sticky md:top-0"
      style={{ zIndex: index + 1 }}
    >
      <div className="border-t border-[var(--line-1)] bg-[var(--bg-0)] md:min-h-[100svh] md:origin-top">
        <div className="mx-auto grid max-w-[var(--container)] items-center gap-10 px-[var(--gutter)] py-16 md:min-h-[100svh] md:grid-cols-12 md:gap-16 md:py-24">
          {/* Text column */}
          <div ref={bodyRef} className="md:col-span-5">
            <div data-panel-meta className="mb-6 flex items-center gap-3" style={{ opacity: 0 }}>
              <span className="meta text-[var(--accent)]">{num}</span>
              <span className="h-px w-8 bg-[var(--line-2)]" />
              <span className="meta">{project.tags[0]}</span>
            </div>

            <h3 ref={titleRef} className="display-md mb-5 font-semibold">
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

          {/* Cover */}
          <div className="md:col-span-7">
            {href ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} — open project`}
                className="group relative block aspect-[16/11] overflow-hidden rounded-[var(--radius)] border border-[var(--line-1)] transition-colors duration-300 hover:border-[var(--line-2)]"
              >
                <ProjectCover project={project} index={index} />
              </a>
            ) : (
              <div className="group relative block aspect-[16/11] overflow-hidden rounded-[var(--radius)] border border-[var(--line-1)]">
                <ProjectCover project={project} index={index} />
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export function SelectedWork() {
  const stackRef = useRef<HTMLDivElement>(null);

  /* Outgoing panels recede as the next one slides over them. */
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
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
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="projects" className="relative z-10 bg-[var(--bg-0)]">
      <div className="mx-auto max-w-[var(--container)] px-[var(--gutter)] pt-[var(--section-pad)]">
        <SectionHeader
          index="01"
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
