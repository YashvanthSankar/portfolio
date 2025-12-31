"use client";

import { CardSpotlight } from "@/components/ui/card-spotlight";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Timeline } from "@/components/ui/timeline";
import { GraduationCap, Briefcase, Code2 } from "lucide-react";
import { experience } from "@/data/experience";
import { Experience } from "@/data/types";
import React from "react";

export function ExperienceTimeline() {
  // Group experience items by period
  const groupedExperience = experience.reduce((acc, item) => {
    if (!acc[item.period]) {
      acc[item.period] = [];
    }
    acc[item.period].push(item);
    return acc;
  }, {} as Record<string, Experience[]>);

  const timelineData = Object.entries(groupedExperience).map(([period, items]) => ({
    title: period,
    content: (
      <div className="space-y-6">
        {items.map((item, index) => (
          <div key={index} className="relative rounded-2xl">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
              borderWidth={2}
            />
            <CardSpotlight
              className="h-full p-6 bg-zinc-950 border-zinc-800 rounded-2xl"
              radius={250}
              color="#1f1f1f"
            >
              <div className="relative z-30 flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-zinc-800">
                  {getIcon(item.type, item.title)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {item.title}
                  </h3>
                  {item.organization && (
                    <p className="text-zinc-500">{item.organization}</p>
                  )}
                </div>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed mb-4 relative z-30">
                {item.description}
              </p>

              {/* Bullet points for Education/Detailed roles */}
              {item.bullets && (
                <ul className="space-y-2 relative z-30 mb-4">
                  {item.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-zinc-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 mt-1.5 shrink-0" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}

              {/* Tags for Technical roles */}
              {item.tags && (
                <div className="flex flex-wrap gap-2 relative z-30">
                  {item.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 text-xs rounded-full bg-zinc-800 text-zinc-400">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </CardSpotlight>
          </div>
        ))}
      </div>
    ),
  }));

  return (
    <section id="experience" className="bg-zinc-950">
      <div className="max-w-5xl mx-auto">
        <Timeline data={timelineData} />
      </div>
    </section>
  );
}

function getIcon(type: string, title: string) {
  if (type === "education") return <GraduationCap className="w-4 h-4 text-zinc-400" />;
  if (title.toLowerCase().includes("web")) return <Code2 className="w-4 h-4 text-zinc-400" />;
  return <Briefcase className="w-4 h-4 text-zinc-400" />;
}