"use client";

import { CardSpotlight } from "@/components/ui/card-spotlight";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Timeline } from "@/components/ui/timeline";
import { GraduationCap, Briefcase, Code2 } from "lucide-react";

export function ExperienceTimeline() {
  const timelineData = [
    {
      title: "2024-2029",
      content: (
        <div className="relative rounded-2xl">
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
                <GraduationCap className="w-4 h-4 text-zinc-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  BTech + MTech in Computer Science
                </h3>
                <p className="text-zinc-500">IIITDM Kancheepuram</p>
              </div>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed mb-4 relative z-30">
              Pursuing an integrated dual degree program (2024-2029) with a focus on software engineering, AI/ML, and full-stack development.
            </p>
            <ul className="space-y-2 relative z-30">
              <li className="flex items-start gap-2 text-sm text-zinc-500">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 mt-1.5 shrink-0" />
                Specialized in Machine Learning and Web Technologies
              </li>
              <li className="flex items-start gap-2 text-sm text-zinc-500">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 mt-1.5 shrink-0" />
                Active member of the college coding club
              </li>
              <li className="flex items-start gap-2 text-sm text-zinc-500">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 mt-1.5 shrink-0" />
                Participated in multiple hackathons and coding competitions
              </li>
            </ul>
          </CardSpotlight>
        </div>
      ),
    },
    {
      title: "2025",
      content: (
        <div className="space-y-6">
          {/* Backend Dev Intern */}
          <div className="relative rounded-2xl">
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
                  <Briefcase className="w-4 h-4 text-zinc-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Backend Developer Intern
                  </h3>
                  <p className="text-zinc-500">reel.cat</p>
                </div>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed mb-4 relative z-30">
                Part of the video and audio processing team, building scalable backend infrastructure for media handling and processing pipelines.
              </p>
              <div className="flex flex-wrap gap-2 relative z-30">
                <span className="px-3 py-1 text-xs rounded-full bg-zinc-800 text-zinc-400">Docker</span>
                <span className="px-3 py-1 text-xs rounded-full bg-zinc-800 text-zinc-400">Remotion</span>
                <span className="px-3 py-1 text-xs rounded-full bg-zinc-800 text-zinc-400">Convex</span>
              </div>
            </CardSpotlight>
          </div>

          {/* Web Dev Intern */}
          <div className="relative rounded-2xl">
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
                  <Code2 className="w-4 h-4 text-zinc-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Web Developer Intern
                  </h3>
                  <p className="text-zinc-500">Tech Affairs & E-Cell, IIITDM Kancheepuram</p>
                </div>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed mb-4 relative z-30">
                Developed the official website for the Tech Affairs and Entrepreneurship Cell, creating a modern web presence for the institution.
              </p>
              <div className="flex flex-wrap gap-2 relative z-30">
                <span className="px-3 py-1 text-xs rounded-full bg-zinc-800 text-zinc-400">Next.js</span>
                <span className="px-3 py-1 text-xs rounded-full bg-zinc-800 text-zinc-400">React</span>
                <span className="px-3 py-1 text-xs rounded-full bg-zinc-800 text-zinc-400">Tailwind CSS</span>
              </div>
            </CardSpotlight>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="experience" className="bg-zinc-950">
      <div className="max-w-5xl mx-auto">
        <Timeline data={timelineData} />
      </div>
    </section>
  );
}