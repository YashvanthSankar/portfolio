"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { GlowingEffect } from "@/components/ui/glowing-effect";

const projects = [
  {
    title: "Preploot",
    description:
      "A comprehensive platform for BTech students with personalized prep modules, curated YouTube resources, and real-time analytics. Features dynamic learning paths and progress tracking.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "MongoDB", "Prisma"],
    image: "/projects/preploot.png",
    github: "https://github.com/YashvanthSankar",
    live: "https://preploot.vercel.app",
  },
  {
    title: "QwikRead AI",
    description:
      "An AI-powered research assistant that summarizes documents and generates insights using LangChain and RAG architecture. Supports multiple document formats with intelligent query processing.",
    tags: ["Python", "LangChain", "RAG", "FastAPI", "React"],
    image: "/projects/qwikread.png",
    github: "https://github.com/YashvanthSankar",
    live: "https://qwikread.vercel.app",
  },
  {
    title: "Hospital ER Automation",
    description:
      "Enterprise-grade emergency room system that reduced wait times by 40% through intelligent triage, automated patient prioritization, and real-time bed management.",
    tags: ["React", "Node.js", "PostgreSQL", "Docker", "Socket.io"],
    image: "/projects/hospital.png",
    github: "https://github.com/YashvanthSankar",
    live: null,
  },
];

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="relative rounded-2xl"
    >
      {/* Subtle Glowing Effect */}
      <GlowingEffect
        spread={40}
        glow={false}
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
        {/* Header */}
        <div className="flex items-start justify-between mb-4 relative z-20">
          <h3 className="text-xl font-bold text-white">
            {project.title}
          </h3>
          <div className="flex items-center gap-2">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
              >
                <Github className="w-4 h-4 text-zinc-400" />
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-zinc-400" />
              </a>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-zinc-400 text-sm leading-relaxed mb-6 relative z-20">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 relative z-20">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs font-medium text-zinc-400 bg-zinc-800/50 rounded-full border border-zinc-700/50"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardSpotlight>
    </motion.div>
  );
}

export function ProjectsSection() {
  return (
    <section id="projects" className="py-24 bg-zinc-950">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Featured Projects
          </h2>
          <p className="text-zinc-400 max-w-xl">
            A selection of projects that showcase my expertise in building 
            modern web applications and solving complex problems.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <a
            href="https://github.com/YashvanthSankar"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
          >
            <span>View all projects on GitHub</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
