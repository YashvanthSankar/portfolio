import { experience } from "@/data/experience";
import { SectionBorder } from "@/components/ui/section-border";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";

export function ExperienceTimeline() {
  return (
    <SectionBorder id="experience">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <SectionHeader
          label="05 / Experience"
          title="Learning by building."
          description="The roles and places shaping how I think about software."
          className="mb-0"
        />
        <div className="divide-y divide-[var(--border-ink)] border-y border-[var(--border-ink)]">
          {experience.map((item, index) => (
            <Reveal key={`${item.title}-${item.period}`} delay={index * 70}>
              <article className="grid gap-5 py-7 sm:grid-cols-[7rem_1fr]">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">{item.period}</span>
                  <span className="mt-2 block text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">{item.type}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold tracking-[-0.025em]">{item.title}</h3>
                  {item.organization && <p className="mt-1 text-sm text-[var(--ink)]">{item.organization}</p>}
                  <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">{item.description}</p>
                  {item.tags && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}
                    </div>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </SectionBorder>
  );
}
