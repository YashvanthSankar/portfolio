"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, Loader2, Check } from "lucide-react";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import { Button, Dot } from "@/components/ui/primitives";
import { socials } from "@/data/socials";

export function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "", website: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || "Request failed");
      }
      setStatus("sent");
      setForm({ name: "", email: "", message: "", website: "" });
      setTimeout(() => setStatus("idle"), 4000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <Section id="contact">
      <SectionHeader
        label="Contact"
        title="Let's build something."
        description="Have a project in mind? Drop me a message and let's make it worth showing off."
      />

      <div className="grid gap-12 md:grid-cols-5 md:gap-16">
        {/* Info */}
        <Reveal className="md:col-span-2">
          <div className="space-y-8">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
                Email
              </p>
              <a
                href="mailto:yashvanthsankar@gmail.com"
                className="link-underline mt-1.5 text-base font-medium text-ink"
              >
                yashvanthsankar@gmail.com
              </a>
            </div>

            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
                Location
              </p>
              <p className="mt-1.5 text-base text-muted">Chennai, India · GMT+5:30</p>
            </div>

            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
                Status
              </p>
              <p className="mt-1.5 inline-flex items-center gap-2.5 text-base text-muted">
                <Dot className="text-ink" />
                Available for freelance &amp; full-time
              </p>
            </div>

            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
                Elsewhere
              </p>
              <div className="mt-3 flex items-center gap-4">
                {socials.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    {...(!link.noBlank && { target: "_blank", rel: "noopener noreferrer" })}
                    aria-label={link.name}
                    className="text-faint transition-[color,transform] duration-200 hover:-translate-y-0.5 hover:text-ink"
                  >
                    <span className="block h-[18px] w-[18px]">{link.icon}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Form */}
        <Reveal delay={80} className="md:col-span-3">
          <form onSubmit={handleSubmit} className="card relative p-6 md:p-8" noValidate>
            {/* Honeypot: hidden from users, catches bots */}
            <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
              <label htmlFor="website">Website (leave blank)</label>
              <input
                type="text"
                id="website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-ink">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Jane Doe"
                  className="field"
                  required
                  maxLength={80}
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-ink">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="jane@example.com"
                  className="field"
                  required
                  maxLength={200}
                />
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-baseline justify-between">
                <label htmlFor="message" className="block text-sm font-medium text-ink">
                  Message
                </label>
                {form.message.length > 0 && (
                  <span
                    className="font-mono text-[11px] tabular-nums text-faint"
                    aria-live="polite"
                  >
                    {form.message.length}/4000
                  </span>
                )}
              </div>
              <textarea
                id="message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell me about your project, idea, or question…"
                rows={6}
                className="field resize-none"
                required
                minLength={10}
                maxLength={4000}
              />
            </div>

            <AnimatePresence>
              {status === "error" && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  role="alert"
                  className="mt-5 rounded-lg border border-line bg-surface-hover px-4 py-3 text-sm text-ink"
                >
                  {errorMsg || "Something went wrong. Try again."}
                </motion.p>
              )}
              {status === "sent" && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  role="status"
                  className="mt-5 flex items-center gap-2 rounded-lg border border-line bg-surface-hover px-4 py-3 text-sm text-ink"
                >
                  <Check className="h-4 w-4" />
                  Message sent. I&apos;ll get back to you shortly.
                </motion.p>
              )}
            </AnimatePresence>

            <Button
              size="lg"
              type="submit"
              disabled={status === "sending" || status === "sent"}
              className="mt-6 w-full"
            >
              {status === "idle" && (
                <>
                  <Send className="h-4 w-4" /> Send message
                </>
              )}
              {status === "sending" && (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                </>
              )}
              {status === "sent" && (
                <>
                  <Check className="h-4 w-4" /> Sent
                </>
              )}
              {status === "error" && (
                <>
                  <Send className="h-4 w-4" /> Try again
                </>
              )}
            </Button>

            <p className="mt-4 text-center font-mono text-[11px] text-faint">
              Rate-limited to 3 messages per hour · honeypot, not a CAPTCHA
            </p>
          </form>
        </Reveal>
      </div>
    </Section>
  );
}
