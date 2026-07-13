"use client";

import { experience } from "@/data/experience";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import { Tag, Dot } from "@/components/ui/primitives";

function isOngoing(period: string): boolean {
  // Match patterns like "2024-2029", "2024-Present"
  const range = period.split(/[-–—]/);
  if (range.length < 2) return false;
  const end = range[1].trim();
  const currentYear = new Date().getFullYear();
  if (/present|current|now/i.test(end)) return true;
  const endYear = parseInt(end, 10);
  return !isNaN(endYear) && endYear >= currentYear;
}

export function ExperienceSection() {
  return (
    <Section id="experience">
      <SectionHeader
        label="Journey"
        title="Where I've been."
        description="Studying, shipping, learning. The chapters that brought me here."
      />

      <ol className="divide-y divide-line border-t border-line">
        {experience.map((item, i) => {
          const ongoing = isOngoing(item.period);
          return (
            <Reveal as="li" key={`${item.title}-${i}`} delay={i * 60}>
              <div className="grid gap-3 py-10 md:grid-cols-[180px_1fr] md:gap-10">
                {/* Period */}
                <div className="flex items-start gap-2.5 pt-0.5">
                  <span className="font-mono text-[13px] tabular-nums tracking-wide text-muted">
                    {item.period}
                  </span>
                  {ongoing && <Dot className="mt-[5px] text-ink" />}
                </div>

                {/* Body */}
                <div>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="text-base font-medium text-ink">{item.title}</h3>
                    {item.organization && (
                      <span className="text-sm text-faint">{item.organization}</span>
                    )}
                    <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
                      {item.type === "education" ? "Education" : "Work"}
                    </span>
                  </div>

                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                    {item.description}
                  </p>

                  {item.bullets && (
                    <ul className="mt-4 space-y-1.5">
                      {item.bullets.map((b, idx) => (
                        <li key={idx} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                          <span className="select-none text-faint" aria-hidden="true">
                            –
                          </span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}

                  {item.tags && item.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          );
        })}
      </ol>
    </Section>
  );
}
