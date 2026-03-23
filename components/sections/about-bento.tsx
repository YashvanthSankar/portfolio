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
    <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
      {copied ? <><Check className="w-3 h-3 text-emerald-500" /><span className="text-emerald-500">copied!</span></> : <><Copy className="w-3 h-3" /><span>copy</span></>}
    </button>
  );
}

const stats = [
  { label: "projects", value: "15+" },
  { label: "technologies", value: "20+" },
  { label: "gpa", value: "9.27" },
  { label: "yrs coding", value: "4+" },
];

const card = "rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 sm:p-6";

export function AboutBento() {
  return (
    <SectionBorder id="about" innerClassName="px-4 sm:px-6 py-12 md:py-20">
        <SectionHeader
          label="about"
          title={<>about <span className="text-violet-600 dark:text-violet-400">me</span></>}
          description="A passionate developer focused on creating impactful digital experiences."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Bio card */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 }} className={`md:col-span-2 ${card}`}>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">Yashvanth S</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              CS student at IIITDM Kancheepuram (BTech + MTech). I specialize in full-stack web
              applications and AI-powered solutions that solve real-world problems. When not coding,
              you&apos;ll find me exploring new technologies and contributing to open-source.
            </p>
          </motion.div>

          {/* Location */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className={card}>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-violet-500" />
              <span className="text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">location</span>
            </div>
            <p className="text-base font-semibold text-zinc-900 dark:text-white">Chennai, India</p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">IIITDM Kancheepuram</p>
          </motion.div>

          {/* Email */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }} className={card}>
            <div className="flex items-center gap-2 mb-3">
              <Mail className="w-4 h-4 text-violet-500" />
              <span className="text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">contact</span>
            </div>
            <p className="text-sm text-zinc-900 dark:text-white font-medium mb-2 break-all">yashvanthsankar@gmail.com</p>
            <CopyButton text="yashvanthsankar@gmail.com" />
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className={`md:col-span-2 ${card}`}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl font-bold text-violet-600 dark:text-violet-400 tabular-nums">{s.value}</div>
                  <div className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Availability */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.25 }} className={`md:col-span-3 ${card} flex items-center gap-3`}>
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">available for freelance &amp; full-time opportunities</span>
          </motion.div>
        </div>
    </SectionBorder>
  );
}
