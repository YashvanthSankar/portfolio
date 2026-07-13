"use client";

import { ExternalLink, Github, ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import { Button, Tag } from "@/components/ui/primitives";

function ProjectCard({ project }: { project: (typeof projects)[0] }) {
  const primaryHref = project.live ?? project.github;

  return (
    <article className="card card-hover group flex h-full flex-col p-6">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-medium text-ink">
          {primaryHref ? (
            <a
              href={primaryHref}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline"
            >
              {project.title}
            </a>
          ) : (
            project.title
          )}
        </h3>
        <div className="flex shrink-0 items-center gap-0.5">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} on GitHub`}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-faint transition-colors duration-200 hover:bg-surface-hover hover:text-ink"
            >
              <Github className="h-4 w-4" />
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} live site`}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-faint transition-colors duration-200 hover:bg-surface-hover hover:text-ink"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
        {project.description}
      </p>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>
    </article>
  );
}

export function ProjectsSection() {
  return (
    <Section id="projects">
      <SectionHeader
        label="Selected work"
        title="Featured projects."
        description="Things I've shipped across web apps, AI tooling, and quiet automation."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <Reveal key={project.title} delay={i * 70} className="h-full">
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>

      <Reveal delay={200}>
        <div className="mt-12 flex justify-center">
          <Button as="link" href="/work" variant="secondary" size="lg" className="group">
            Explore all projects
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}
