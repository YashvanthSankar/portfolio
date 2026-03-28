"use client";

import { motion } from "framer-motion";
import { MapPin, Mail, Check, Copy } from "lucide-react";
import { useState } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionBorder } from "@/components/ui/section-border";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
    >
      {copied
        ? <><Check className="w-3 h-3 text-emerald-500" /><span className="text-emerald-500">copied</span></>
        : <><Copy className="w-3 h-3" /><span>copy</span></>
      }
    </button>
  );
}

const stats = [
  { label: "projects",     value: "15+" },
  { label: "technologies", value: "20+" },
  { label: "gpa",          value: "9.27" },
  { label: "yrs coding",   value: "4+"  },
];

const card = "rounded-xl border border-rose-200 dark:border-rose-900/40 bg-[#FFE4E6] dark:bg-[#1a0509] p-5";

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

export function AboutBento() {
  return (
    <SectionBorder id="about" coord="(1)" innerClassName="px-6 sm:px-10 py-16 md:py-24">
      <SectionHeader
        label="about"
        title={<>about <span className="text-rose-600 dark:text-rose-400">me</span></>}
        description="A passionate developer focused on creating impactful digital experiences."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Bio */}
        <motion.div {...fade(0.05)} className={`md:col-span-2 ${card}`}>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            CS student at IIITDM Kancheepuram (BTech + MTech). I specialize in full-stack web
            applications and AI-powered solutions that solve real-world problems. When not coding,
            I&apos;m exploring new technologies and contributing to open-source.
          </p>
        </motion.div>

        {/* Location */}
        <motion.div {...fade(0.1)} className={card}>
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">location</span>
          </div>
          <p className="text-sm font-medium text-zinc-900 dark:text-white">Chennai, India</p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">IIITDM Kancheepuram</p>
        </motion.div>

        {/* Email */}
        <motion.div {...fade(0.15)} className={card}>
          <div className="flex items-center gap-2 mb-3">
            <Mail className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">email</span>
          </div>
          <a
            href="mailto:yashvanthsankar@gmail.com"
            className="block text-sm text-zinc-900 dark:text-white font-medium mb-2 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors break-words"
          >
            yashvanthsankar@gmail.com
          </a>
          <CopyButton text="yashvanthsankar@gmail.com" />
        </motion.div>

        {/* Stats */}
        <motion.div {...fade(0.2)} className={`md:col-span-2 ${card}`}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-bold text-zinc-900 dark:text-white tabular-nums">{s.value}</div>
                <div className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5 uppercase tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Availability */}
        <motion.div {...fade(0.25)} className={`md:col-span-3 ${card} flex items-center gap-3`}>
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            available for <span className="text-zinc-900 dark:text-white font-medium">freelance</span> &amp; <span className="text-zinc-900 dark:text-white font-medium">full-time</span> opportunities
          </span>
        </motion.div>
      </div>
    </SectionBorder>
  );
}
