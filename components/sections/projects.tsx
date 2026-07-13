import { ArrowUpRight, Github } from "lucide-react";
import { projects } from "@/data/projects";
import { SectionBorder } from "@/components/ui/section-border";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";

export function ProjectsSection() {
  return (
    <SectionBorder id="projects">
      <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
        <SectionHeader
          label="04 / Selected work"
          title="A few things I’ve built."
          description="Products across learning, AI tooling, and useful automation."
          className="mb-0"
        />
        <a href="/work" className="text-link mb-1 shrink-0">All projects <ArrowUpRight className="arrow-nudge h-4 w-4" /></a>
      </div>

      <div className="mt-14 divide-y divide-[var(--border-ink)] border-y border-[var(--border-ink)]">
        {projects.map((project, index) => (
          <Reveal key={project.title} delay={index * 70}>
            <article className="project-entry group grid gap-5 py-8 md:grid-cols-[3rem_0.8fr_1.3fr_auto] md:items-start md:gap-8">
              <span className="font-mono text-[10px] tabular-nums text-[var(--muted)]">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="project-entry__title text-xl font-semibold tracking-[-0.035em] md:text-2xl">{project.title}</h3>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.tags.slice(0, 3).map((tag) => <span key={tag} className="tag">{tag}</span>)}
                </div>
              </div>
              <p className="max-w-2xl text-sm leading-6 text-[var(--muted)] md:text-base md:leading-7">{project.description}</p>
              <div className="flex items-center gap-2 md:justify-end">
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} source code`} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-ink)] transition-[border-color,transform] hover:-translate-y-0.5 hover:border-[var(--ink)]">
                    <Github className="h-3.5 w-3.5" />
                  </a>
                )}
                {project.live && (
                  <a href={project.live} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${project.title}`} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-ink)] transition-[border-color,transform] hover:-translate-y-0.5 hover:border-[var(--ink)]">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </SectionBorder>
  );
}
