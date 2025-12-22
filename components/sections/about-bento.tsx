"use client";

import { motion } from "framer-motion";
import { MapPin, Mail, Check, Copy } from "lucide-react";
import { useState } from "react";

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
      className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-emerald-500" />
          <span className="text-emerald-500">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          <span>Copy Email</span>
        </>
      )}
    </button>
  );
}

const stats = [
  { label: "Projects Completed", value: "15+" },
  { label: "Technologies", value: "20+" },
  { label: "Current GPA", value: "9.27" },
  { label: "Years Coding", value: "4+" },
];

export function AboutBento() {
  return (
    <section id="about" className="py-24 bg-zinc-950">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            About Me
          </h2>
          <p className="text-zinc-400 max-w-xl">
            A passionate developer focused on creating impactful digital experiences.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Main Bio Card - Large */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors"
          >
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-700 to-zinc-800 shrink-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">YS</span>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Yashvanth S
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  I&apos;m a Computer Science student at IIITDM Kancheepuram pursuing 
                  an integrated BTech + MTech degree. I specialize in building 
                  full-stack web applications and AI-powered solutions that solve 
                  real-world problems. When I&apos;m not coding, you&apos;ll find me 
                  exploring new technologies and contributing to open-source projects.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Location Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-zinc-800">
                <MapPin className="w-5 h-5 text-zinc-400" />
              </div>
              <span className="text-sm text-zinc-500 uppercase tracking-wide">
                Location
              </span>
            </div>
            <p className="text-xl font-semibold text-white">Chennai, India</p>
            <p className="text-zinc-500 text-sm mt-1">IIITDM Kancheepuram</p>
          </motion.div>

          {/* Email Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-zinc-800">
                <Mail className="w-5 h-5 text-zinc-400" />
              </div>
              <span className="text-sm text-zinc-500 uppercase tracking-wide">
                Contact
              </span>
            </div>
            <p className="text-white font-medium mb-2">yashvanth@email.com</p>
            <CopyButton text="yashvanth@email.com" />
          </motion.div>

          {/* Stats Card - Wide */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="md:col-span-2 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-zinc-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
