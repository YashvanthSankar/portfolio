"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, MapPin, Loader2, Check } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionBorder } from "@/components/ui/section-border";

const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/YashvanthSankar",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/yashvanths",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: "X",
    href: "https://x.com/yashvanth57950",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
      </svg>
    ),
  },
  {
    name: "Codeforces",
    href: "https://codeforces.com/profile/yashvanths",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M4.5 7.5A1.5 1.5 0 013 6V4.5A1.5 1.5 0 014.5 3h3A1.5 1.5 0 019 4.5V6a1.5 1.5 0 01-1.5 1.5h-3zM4.5 21A1.5 1.5 0 013 19.5v-9A1.5 1.5 0 014.5 9h3A1.5 1.5 0 019 10.5v9A1.5 1.5 0 017.5 21h-3zm7.5 0a1.5 1.5 0 01-1.5-1.5v-15A1.5 1.5 0 0112 3h3a1.5 1.5 0 011.5 1.5v15A1.5 1.5 0 0115 21h-3zm7.5 0a1.5 1.5 0 01-1.5-1.5v-6A1.5 1.5 0 0119.5 12H21a1.5 1.5 0 011.5 1.5v6A1.5 1.5 0 0121 21h-1.5z" />
      </svg>
    ),
  },
  {
    name: "LeetCode",
    href: "https://leetcode.com/u/yashvanths/",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M13.483 0a1.374 1.374 0 00-.961.438L7.116 6.226l-3.854 4.126a1.374 1.374 0 000 1.898l3.854 4.127 5.406 5.788a1.374 1.374 0 001.961 0l1.114-1.19a1.374 1.374 0 000-1.898l-4.396-4.71 4.396-4.71a1.374 1.374 0 000-1.898l-1.114-1.19a1.374 1.374 0 00-1-.437zm-2.966 12.765a.524.524 0 010 .738l-2.28 2.443a.524.524 0 01-.756 0l-2.28-2.443a.524.524 0 010-.738l2.28 2.443a.524.524 0 01.756 0l2.28-2.443zm9.423-2.558a1.374 1.374 0 00-1.374 0l-2.28 2.443a1.374 1.374 0 000 1.898l2.28 2.443a1.374 1.374 0 001.374 0V10.207z" />
      </svg>
    ),
  },
];

const inputClass =
  "w-full px-4 py-2.5 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-violet-400 dark:focus:border-violet-500 focus:ring-1 focus:ring-violet-400/30 dark:focus:ring-violet-500/20 transition-all";

export function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 4000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <SectionBorder id="contact" innerClassName="px-4 sm:px-6 py-12 md:py-20 max-w-4xl">
        <SectionHeader
          label="get in touch"
          title={<>let&apos;s work <span className="text-violet-600 dark:text-violet-400">together</span></>}
          description="Have a project in mind? Send me a message and let's create something amazing."
        />

        <div className="grid md:grid-cols-5 gap-8 md:gap-10">
          {/* Left info */}
          <motion.div initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="md:col-span-2 space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                  <Mail className="w-4 h-4 text-violet-500" />
                </div>
                <div>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-0.5">email</p>
                  <p className="text-sm text-zinc-900 dark:text-white">yashvanthsankar@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                  <MapPin className="w-4 h-4 text-violet-500" />
                </div>
                <div>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-0.5">location</p>
                  <p className="text-sm text-zinc-900 dark:text-white">Chennai, India</p>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="flex gap-2">
              {socialLinks.map((link) => (
                <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.name}
                  className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
                  {link.icon}
                </a>
              ))}
            </div>

            {/* Availability */}
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/10">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs text-emerald-700 dark:text-emerald-400">available for opportunities</span>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} onSubmit={handleSubmit} className="md:col-span-3 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1.5">name</label>
                <input type="text" id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" className={inputClass} required />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1.5">email</label>
                <input type="email" id="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" className={inputClass} required />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1.5">message</label>
              <textarea id="message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell me about your project..." rows={4} className={`${inputClass} resize-none`} required />
            </div>

            {status === "error" && (
              <p className="text-xs text-red-500">something went wrong — try again.</p>
            )}

            <button type="submit" disabled={status === "sending" || status === "sent"}
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
              {status === "idle"    && <><Send className="w-3.5 h-3.5" /> send message</>}
              {status === "sending" && <><Loader2 className="w-3.5 h-3.5 animate-spin" /> sending...</>}
              {status === "sent"    && <><Check className="w-3.5 h-3.5" /> message sent!</>}
              {status === "error"   && <><Send className="w-3.5 h-3.5" /> try again</>}
            </button>
          </motion.form>
        </div>
    </SectionBorder>
  );
}
