"use client";

import { Timeline } from "@/components/ui/timeline";
import { SectionBorder } from "@/components/ui/section-border";
import { GraduationCap, Briefcase, Code2 } from "lucide-react";
import { experience } from "@/data/experience";
import { Experience } from "@/data/types";

export function ExperienceTimeline() {
  const grouped = experience.reduce((acc, item) => {
    if (!acc[item.period]) acc[item.period] = [];
    acc[item.period].push(item);
    return acc;
  }, {} as Record<string, Experience[]>);

  const timelineData = Object.entries(grouped).map(([period, items]) => ({
    title: period,
    content: (
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-violet-300 dark:hover:border-violet-700 transition-colors overflow-hidden">
            {/* Card header */}
            <div className="flex items-center gap-3 px-5 py-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className={`p-1.5 rounded-md ${item.type === "education" ? "bg-emerald-50 dark:bg-emerald-900/20" : "bg-blue-50 dark:bg-blue-900/20"}`}>
                {getIcon(item.type, item.title)}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">{item.title}</h3>
                {item.organization && <p className="text-xs text-zinc-400 dark:text-zinc-500">{item.organization}</p>}
              </div>
            </div>

            {/* Card body */}
            <div className="px-5 py-4">
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-3">{item.description}</p>

              {item.bullets && (
                <ul className="space-y-1.5 mb-3">
                  {item.bullets.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-zinc-400 dark:text-zinc-500">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-violet-400 shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              )}

              {item.tags && (
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 text-[11px] rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    ),
  }));

  return (
    <SectionBorder id="experience">
      <Timeline data={timelineData} />
    </SectionBorder>
  );
}

function getIcon(type: string, title: string) {
  if (type === "education") return <GraduationCap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
  if (title.toLowerCase().includes("web")) return <Code2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />;
  return <Briefcase className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />;
}
