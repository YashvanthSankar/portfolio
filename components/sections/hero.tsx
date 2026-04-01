"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { Download, ArrowUpRight, Mail } from "lucide-react";
import { Hero3DName } from "@/components/sections/hero-3d-name";

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/YashvanthSankar",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/yashvanths",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://x.com/yashvanths19",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
      </svg>
    ),
  },
  {
    label: "Codeforces",
    href: "https://codeforces.com/profile/yashvanths",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M4.5 7.5A1.5 1.5 0 013 6V4.5A1.5 1.5 0 014.5 3h3A1.5 1.5 0 019 4.5V6a1.5 1.5 0 01-1.5 1.5h-3zM4.5 21A1.5 1.5 0 013 19.5v-9A1.5 1.5 0 014.5 9h3A1.5 1.5 0 019 10.5v9A1.5 1.5 0 017.5 21h-3zm7.5 0a1.5 1.5 0 01-1.5-1.5v-15A1.5 1.5 0 0112 3h3a1.5 1.5 0 011.5 1.5v15A1.5 1.5 0 0115 21h-3zm7.5 0a1.5 1.5 0 01-1.5-1.5v-6A1.5 1.5 0 0119.5 12H21a1.5 1.5 0 011.5 1.5v6A1.5 1.5 0 0121 21h-1.5z" />
      </svg>
    ),
  },
  {
    label: "LeetCode",
    href: "https://leetcode.com/u/yashvanths/",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M13.483 0a1.374 1.374 0 00-.961.438L7.116 6.226l-3.854 4.126a1.374 1.374 0 000 1.898l3.854 4.127 5.406 5.788a1.374 1.374 0 001.961 0l1.114-1.19a1.374 1.374 0 000-1.898l-4.396-4.71 4.396-4.71a1.374 1.374 0 000-1.898l-1.114-1.19a1.374 1.374 0 00-1-.437zm-2.966 12.765a.524.524 0 010 .738l-2.28 2.443a.524.524 0 01-.756 0l-2.28-2.443a.524.524 0 010-.738l2.28-2.443a.524.524 0 01.756 0l2.28 2.443zm9.423-2.558a1.374 1.374 0 00-1.374 0l-2.28 2.443a1.374 1.374 0 000 1.898l2.28 2.443a1.374 1.374 0 001.374 0V10.207z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com/yashvanth191206",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:yashvanthsankar@gmail.com",
    icon: <Mail className="w-4 h-4" />,
    noBlank: true,
  },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const reveal: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

export function SpotlightHero() {
  return (
    <section
      id="home"
      className="relative min-h-[100dvh] flex items-center overflow-hidden border-b border-rose-200 dark:border-rose-900/40"
    >
      {/* Grain texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02] dark:opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0px, transparent 72px, black 140px)",
          maskImage: "linear-gradient(to bottom, transparent 0px, transparent 72px, black 140px)",
        }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-10 pt-28 pb-24"
      >
        {/* Availability badge */}
        <motion.div variants={reveal} className="mb-10">
          <span className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-rose-200 dark:border-rose-900/40 bg-rose-50/70 dark:bg-[#1a0509]/70 text-[10px] tracking-[0.18em] uppercase text-zinc-500 dark:text-zinc-400">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            open to opportunities
          </span>
        </motion.div>

        {/* Name — 3D typography */}
        <motion.div variants={reveal}>
          <Hero3DName />
        </motion.div>

        {/* Role + description */}
        <motion.div variants={reveal} className="mb-10 max-w-xl">
          <p className="font-mono text-[11px] tracking-[0.24em] uppercase text-zinc-500 dark:text-zinc-400 mb-4">
            Full-Stack Developer & AI Engineer
          </p>
          <p className="font-mono text-base sm:text-lg text-zinc-700 dark:text-zinc-300 leading-[1.75]">
            Building fast, impactful products for the modern web and AI-first workflows.{" "}
            <span className="text-zinc-500 dark:text-zinc-400">
              CS student at IIITDM Kancheepuram.
            </span>
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div variants={reveal} className="flex flex-wrap items-center gap-3">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                       bg-[#1a0509] dark:bg-white text-white dark:text-zinc-900
                       text-sm font-semibold
                       hover:bg-zinc-800 dark:hover:bg-zinc-100
                       transition-colors duration-200"
          >
            view my work
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                       border border-rose-200 dark:border-rose-900/40
                       text-zinc-600 dark:text-zinc-300 text-sm font-medium
                       hover:border-rose-300 dark:hover:border-rose-800
                       hover:text-zinc-900 dark:hover:text-white
                       transition-all duration-200"
          >
            get in touch
          </a>

          <a
            href="/YashvanthS_Resume.pdf"
            download
            className="inline-flex items-center gap-1.5 px-4 py-3
                       text-[10.5px] tracking-[0.18em] uppercase
                       text-zinc-400 dark:text-zinc-600
                       hover:text-zinc-600 dark:hover:text-zinc-400
                       transition-colors duration-150"
          >
            <Download className="w-3 h-3" />
            resume
          </a>
        </motion.div>

        {/* Socials */}
        <motion.div variants={reveal} className="mt-16 flex items-center gap-1">
          {socials.map(({ label, href, icon, noBlank }) => (
            <a
              key={label}
              href={href}
              {...(!noBlank && { target: "_blank", rel: "noopener noreferrer" })}
              aria-label={label}
              className="p-2 rounded-lg text-zinc-400 dark:text-zinc-500
                         hover:text-zinc-900 dark:hover:text-white
                         hover:bg-[#FFE4E6] dark:hover:bg-[#1a0509]
                         transition-colors duration-150"
            >
              {icon}
            </a>
          ))}
        </motion.div>
      </motion.div>

    </section>
  );
}
