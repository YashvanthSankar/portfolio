"use client";

import { motion } from "framer-motion";
import { Briefcase, GraduationCap } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";

const experiences = [
  {
    type: "education",
    title: "BTech + MTech in Computer Science",
    organization: "IIITDM Kancheepuram",
    period: "2021 - Present",
    description:
      "Pursuing an integrated dual degree program with a focus on software engineering, AI/ML, and full-stack development. Maintaining a GPA of 9.27/10.",
    highlights: [
      "Specialized in Machine Learning and Web Technologies",
      "Active member of the college coding club",
      "Participated in multiple hackathons and coding competitions",
    ],
  },
  {
    type: "work",
    title: "Full Stack Developer Intern",
    organization: "Tech Startup",
    period: "Summer 2023",
    description:
      "Developed and maintained web applications using modern technologies. Collaborated with cross-functional teams to deliver high-quality products.",
    highlights: [
      "Built RESTful APIs using Node.js and Express",
      "Implemented responsive UI components with React",
      "Reduced page load time by 40% through optimization",
    ],
  },
  {
    type: "work",
    title: "Open Source Contributor",
    organization: "Various Projects",
    period: "2022 - Present",
    description:
      "Contributing to open-source projects and building tools that help other developers.",
    highlights: [
      "Contributed to popular React component libraries",
      "Created developer tools used by 500+ developers",
      "Active member of the GitHub community",
    ],
  },
];

export function ExperienceTimeline() {
  return (
    <section id="experience" className="py-24 bg-zinc-950">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Experience & Education
          </h2>
          <p className="text-zinc-400 max-w-xl">
            My journey in technology, from academic pursuits to professional experiences.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-zinc-700 via-zinc-800 to-transparent" />

          {/* Timeline Items */}
          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-20"
              >
                {/* Icon */}
                <div className="absolute left-0 p-3 rounded-full bg-zinc-900 border border-zinc-800">
                  {exp.type === "education" ? (
                    <GraduationCap className="w-4 h-4 text-zinc-400" />
                  ) : (
                    <Briefcase className="w-4 h-4 text-zinc-400" />
                  )}
                </div>

                {/* Content Card */}
                <div className="relative p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors">
                  <GlowingEffect
                    spread={40}
                    glow={false}
                    disabled={false}
                    proximity={64}
                    inactiveZone={0.01}
                    borderWidth={2}
                  />
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {exp.title}
                      </h3>
                      <p className="text-zinc-500">{exp.organization}</p>
                    </div>
                    <span className="text-sm text-zinc-500 font-medium px-3 py-1 rounded-full bg-zinc-800/50 self-start">
                      {exp.period}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                    {exp.description}
                  </p>

                  {/* Highlights */}
                  <ul className="space-y-2">
                    {exp.highlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="flex items-start gap-2 text-sm text-zinc-500"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 mt-1.5 shrink-0" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
