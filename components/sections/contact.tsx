"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, Loader2, Check, Mail, MapPin, Zap } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { shouldAnimate } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionBorder } from "@/components/ui/section-border";
import { BrutalButton } from "@/components/ui/brutal";
import { socials } from "@/data/socials";

export function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "", website: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const sectionRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!shouldAnimate()) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
      });
      tl.fromTo(leftRef.current, { opacity: 0, x: -28 }, { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" })
        .fromTo(
          formRef.current,
          { opacity: 0, x: 28 },
          { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" },
          "-=0.45"
        );

      const icons = leftRef.current?.querySelectorAll("[data-social-icon]");
      if (icons?.length) {
        tl.fromTo(
          icons,
          { opacity: 0, scale: 0.7, y: 8 },
          { opacity: 1, scale: 1, y: 0, duration: 0.35, stagger: 0.05, ease: "back.out(1.7)" },
          "-=0.3"
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

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
    <SectionBorder id="contact" label="// contact" innerClassName="px-6 sm:px-10 py-16 md:py-24">
      <SectionHeader
        label="get in touch"
        title={
          <>
            Let&apos;s{" "}
            <span className="inline-block bg-[var(--accent)] text-[var(--accent-ink)] border-[3px] border-[var(--border-ink)] px-3 shadow-[6px_6px_0_0_var(--border-ink)] -rotate-1">
              build.
            </span>
          </>
        }
        description="Have a project in mind? Drop me a message and let's make something worth showing off."
      />

      <div ref={sectionRef} className="grid md:grid-cols-5 gap-6 md:gap-8">
        {/* Left info */}
        <div ref={leftRef} className="md:col-span-2 space-y-5" style={{ opacity: 0 }}>
          <a
            href="mailto:yashvanthsankar@gmail.com"
            className="flex items-center gap-4 p-5 bg-[var(--ink)] text-[var(--paper)] border-[2.5px] border-[var(--border-ink)] shadow-brutal brutal-card-hover"
          >
            <div className="inline-flex items-center justify-center w-11 h-11 shrink-0 bg-[var(--accent)] text-[var(--accent-ink)] border-2 border-[var(--border-ink)] shadow-[2px_2px_0_0_var(--border-ink)]">
              <Mail className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] mb-1 opacity-70">email</p>
              <p className="font-display font-bold truncate">yashvanthsankar@gmail.com</p>
            </div>
          </a>

          <div className="flex items-center gap-4 p-5 bg-[var(--surface-alt)] border-[2.5px] border-[var(--border-ink)] shadow-brutal">
            <div className="inline-flex items-center justify-center w-11 h-11 shrink-0 bg-[var(--paper)] border-2 border-[var(--border-ink)] shadow-[2px_2px_0_0_var(--border-ink)]">
              <MapPin className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] mb-1">location</p>
              <p className="font-display font-bold text-[var(--ink)]">Chennai, India</p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-3 bg-[var(--accent)] text-[var(--accent-ink)] border-[2.5px] border-[var(--border-ink)] shadow-brutal">
            <Zap className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="font-display font-bold text-sm">Available for opportunities</span>
          </div>

          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] mb-3 text-[var(--ink)]">connect</p>
            <div className="flex flex-wrap gap-2">
              {socials.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  {...(!link.noBlank && { target: "_blank", rel: "noopener noreferrer" })}
                  aria-label={link.name}
                  data-social-icon
                  className="inline-flex items-center justify-center w-10 h-10 border-2 border-[var(--border-ink)] bg-[var(--surface)] text-[var(--ink)] shadow-[3px_3px_0_0_var(--border-ink)] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[4px_4px_0_0_var(--border-ink)] hover:bg-[var(--highlight)] transition-transform duration-150"
                  style={{ opacity: 0 }}
                >
                  <span className="w-4 h-4">{link.icon}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="md:col-span-3 bg-[var(--surface)] border-[2.5px] border-[var(--border-ink)] shadow-brutal p-6 md:p-8 space-y-5"
          style={{ opacity: 0 }}
          noValidate
        >
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

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="name" className="block font-display font-bold text-sm mb-2">
                Name <span className="text-[var(--accent)]">*</span>
              </label>
              <input
                type="text"
                id="name"
                autoComplete="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Jane Doe"
                className="brutal-input"
                required
                maxLength={80}
              />
            </div>
            <div>
              <label htmlFor="email" className="block font-display font-bold text-sm mb-2">
                Email <span className="text-[var(--accent)]">*</span>
              </label>
              <input
                type="email"
                id="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="jane@example.com"
                className="brutal-input"
                required
                maxLength={200}
              />
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block font-display font-bold text-sm mb-2">
              Message <span className="text-[var(--accent)]">*</span>
            </label>
            <textarea
              id="message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Tell me about your project, idea, or question…"
              rows={6}
              className="brutal-input resize-none"
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
                className="px-4 py-3 bg-[var(--accent)] text-[var(--accent-ink)] border-[2.5px] border-[var(--border-ink)] shadow-[3px_3px_0_0_var(--border-ink)] font-display font-bold text-sm"
              >
                {errorMsg || "Something went wrong — try again."}
              </motion.p>
            )}
            {status === "sent" && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                role="status"
                className="px-4 py-3 bg-[var(--success)] text-white border-[2.5px] border-[var(--border-ink)] shadow-[3px_3px_0_0_var(--border-ink)] font-display font-bold text-sm"
              >
                Message sent. I&apos;ll get back to you shortly.
              </motion.p>
            )}
          </AnimatePresence>

          <BrutalButton
            variant="primary"
            size="lg"
            type="submit"
            disabled={status === "sending" || status === "sent"}
            className="w-full disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === "idle" && (
              <>
                <Send className="w-4 h-4" /> Send message
              </>
            )}
            {status === "sending" && (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Sending…
              </>
            )}
            {status === "sent" && (
              <>
                <Check className="w-4 h-4" /> Sent!
              </>
            )}
            {status === "error" && (
              <>
                <Send className="w-4 h-4" /> Try again
              </>
            )}
          </BrutalButton>

          <p className="text-xs font-mono text-[var(--muted)] text-center">
            Rate-limited to 3 messages per hour. Protected by a honeypot, not a CAPTCHA.
          </p>
        </form>
      </div>
    </SectionBorder>
  );
}
