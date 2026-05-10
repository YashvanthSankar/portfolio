"use client";

import { Timeline } from "@/components/ui/timeline";
import { SectionBorder } from "@/components/ui/section-border";
import { GraduationCap, Briefcase, Code2 } from "lucide-react";
import { experience } from "@/data/experience";
import { Experience } from "@/data/types";
import { BrutalTag } from "@/components/ui/brutal";

/**
 * Header bg + icon glyph both vary per entry type. Education uses
 * surface-alt (warm beige) so it reads as the "softer" marker in the set;
 * work uses the accent. Icon differentiates sub-types.
 */
function ExpIcon({ type, title }: { type: string; title: string }) {
  const cn = "w-4 h-4";
  const titleLower = title.toLowerCase();
  if (type === "education") return <GraduationCap className={cn} aria-hidden="true" />;
  if (titleLower.includes("web") || titleLower.includes("dev")) {
    return <Code2 className={cn} aria-hidden="true" />;
  }
  return <Briefcase className={cn} aria-hidden="true" />;
}

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

function ExpCard({ item }: { item: Experience }) {
  const headerBg =
    item.type === "education"
      ? "bg-[var(--surface-alt)] text-[var(--ink)]"
      : "bg-[var(--accent)] text-[var(--accent-ink)]";

  const ongoing = isOngoing(item.period);
  const typeLabel = item.type === "education" ? "EDU" : "WORK";

  return (
    <article className="group bg-[var(--surface)] border-[2.5px] border-[var(--border-ink)] shadow-brutal brutal-card-hover overflow-hidden">
      <div className={`flex items-center gap-3 px-5 py-3 border-b-[2.5px] border-[var(--border-ink)] ${headerBg}`}>
        <div className="inline-flex items-center justify-center w-9 h-9 border-2 border-[var(--border-ink)] bg-[var(--paper)] text-[var(--ink)] shadow-[2px_2px_0_0_var(--border-ink)]">
          <ExpIcon type={item.type} title={item.title} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-display font-bold text-base truncate">{item.title}</h3>
          {item.organization && (
            <p className="font-mono text-xs font-semibold opacity-90">{item.organization}</p>
          )}
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-[0.2em] uppercase shrink-0">
          {ongoing && (
            <span className="relative flex h-2 w-2 items-center justify-center" aria-label="ongoing">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full border-2 border-current opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
            </span>
          )}
          {typeLabel}
        </span>
      </div>

      <div className="p-5">
        <p className="text-sm md:text-base text-[var(--ink)] leading-[1.65] mb-4">
          {item.description}
        </p>

        {item.bullets && (
          <ul className="space-y-2 mb-4">
            {item.bullets.map((b, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-[var(--ink)]">
                <span
                  className="mt-1.5 w-2.5 h-2.5 bg-[var(--ink)] border-2 border-[var(--border-ink)] shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:rotate-45"
                  aria-hidden="true"
                />
                <span className="leading-[1.6]">{b}</span>
              </li>
            ))}
          </ul>
        )}

        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1 border-t-2 border-dashed border-[var(--border-ink)]/30 mt-3 pt-3">
            {item.tags.map((tag) => (
              <BrutalTag key={tag}>{tag}</BrutalTag>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export function ExperienceTimeline() {
  const grouped = experience.reduce((acc, item) => {
    if (!acc[item.period]) acc[item.period] = [];
    acc[item.period].push(item);
    return acc;
  }, {} as Record<string, Experience[]>);

  const timelineData = Object.entries(grouped).map(([period, items]) => ({
    title: period,
    content: (
      <div className="space-y-5">
        {items.map((item, i) => (
          <ExpCard key={i} item={item} />
        ))}
      </div>
    ),
  }));

  return (
    <SectionBorder id="experience" label="// journey">
      <Timeline data={timelineData} />
    </SectionBorder>
  );
}
