"use client";

import { Timeline } from "@/components/ui/timeline";
import { Briefcase, GraduationCap, Code2 } from "lucide-react";

export function ExperienceTimeline() {
  const timelineData = [
    {
      title: "2024",
      content: (
        <div className="space-y-6">
          {/* Backend Dev Intern */}
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
            <div className="flex items-center gap-3 mb-4">
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
            <p className="text-zinc-400 text-sm leading-relaxed mb-4">
              Part of the video and audio processing team, building scalable backend 
              infrastructure for media handling and processing pipelines.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 text-xs rounded-full bg-zinc-800 text-zinc-400">Docker</span>
              <span className="px-3 py-1 text-xs rounded-full bg-zinc-800 text-zinc-400">Remotion</span>
              <span className="px-3 py-1 text-xs rounded-full bg-zinc-800 text-zinc-400">Convex</span>
            </div>
          </div>

          {/* Web Dev Intern */}
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
            <div className="flex items-center gap-3 mb-4">
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
            <p className="text-zinc-400 text-sm leading-relaxed mb-4">
              Developed the official website for the Tech Affairs and Entrepreneurship Cell, 
              creating a modern web presence for the institution.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 text-xs rounded-full bg-zinc-800 text-zinc-400">Next.js</span>
              <span className="px-3 py-1 text-xs rounded-full bg-zinc-800 text-zinc-400">React</span>
              <span className="px-3 py-1 text-xs rounded-full bg-zinc-800 text-zinc-400">Tailwind CSS</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "2021",
      content: (
        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <div className="flex items-center gap-3 mb-4">
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
          <p className="text-zinc-400 text-sm leading-relaxed mb-4">
            Pursuing an integrated dual degree program with a focus on software engineering, 
            AI/ML, and full-stack development.
          </p>
          <ul className="space-y-2">
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
