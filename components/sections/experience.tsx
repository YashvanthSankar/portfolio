"use client";

import { useEffect, useRef } from "react";
import { experience } from "@/data/experience";
import { chapterNumber } from "@/data/sections";
import { SectionHeader } from "@/components/ui/section-header";
import { fadeUp } from "@/lib/split-reveal";
import { REVEAL_START } from "@/lib/motion";

function isOngoing(period: string): boolean {
  const range = period.split(/[-–—]/);
  if (range.length < 2) return false;
  const end = range[1].trim();
  if (/present|current|now/i.test(end)) return true;
  const endYear = parseInt(end, 10);
  return !isNaN(endYear) && endYear >= new Date().getFullYear();
}

export function ExperienceSection() {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cleanup = fadeUp("[data-exp-row]", {
      trigger: listRef.current,
      start: REVEAL_START,
      stagger: 0.1,
      y: 26,
    });
    return cleanup;
  }, []);

  return (
    <section
      id="experience"
      className="relative z-10 border-t border-[var(--line-1)] bg-[var(--bg-0)]"
    >
      <div className="mx-auto max-w-[var(--container)] px-[var(--gutter)] py-[var(--section-pad)]">
        <SectionHeader
          index={chapterNumber("experience")}
          label="experience"
          title={
            <>
              Where I&apos;ve been <span className="serif-accent">so far</span>.
            </>
          }
        />

        <div ref={listRef} className="border-t border-[var(--line-1)]">
          {experience.map((item, i) => (
            <article
              key={`${item.title}-${i}`}
              data-exp-row
              className="group grid gap-4 border-b border-[var(--line-1)] py-9 transition-colors duration-300 md:grid-cols-12 md:gap-8"
              style={{ opacity: 0 }}
            >
              <div className="flex items-center gap-3 md:col-span-3">
                <span className="meta text-[var(--text-2)]">{item.period}</span>
                {isOngoing(item.period) && (
                  <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                )}
              </div>

              <div className="md:col-span-9">
                <div className="mb-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="text-lg font-medium tracking-[-0.01em] text-[var(--text-1)]">
                    {item.title}
                  </h3>
                  {item.organization && (
                    <span className="meta text-[var(--accent)]">{item.organization}</span>
                  )}
                </div>

                <p className="lead mt-3 max-w-2xl text-[15px]">{item.description}</p>

                {item.bullets && (
                  <ul className="mt-4 space-y-2">
                    {item.bullets.map((b, idx) => (
                      <li
                        key={idx}
                        className="flex gap-3 text-sm leading-relaxed text-[var(--text-2)]"
                      >
                        <span className="mt-[0.6em] h-px w-3 shrink-0 bg-[var(--line-2)]" />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}

                {item.tags && item.tags.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                    {item.tags.map((tag) => (
                      <span key={tag} className="meta">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
