"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Loader2, Send } from "lucide-react";
import { socials } from "@/data/socials";
import { SectionBorder } from "@/components/ui/section-border";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "", website: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string; issues?: string[] };
      if (!response.ok) throw new Error(data.issues?.[0] || data.error || "Unable to send your message.");
      setStatus("sent");
      setForm({ name: "", email: "", message: "", website: "" });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  return (
    <SectionBorder id="contact">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <SectionHeader
            label="06 / Contact"
            title="Let’s make something good."
            description="Have a thoughtful project or role in mind? Send a note and I’ll get back to you soon."
            className="mb-8"
          />
          <Reveal delay={80}>
            <a href="mailto:yashvanthsankar@gmail.com" className="text-link text-base">
              yashvanthsankar@gmail.com <ArrowUpRight className="arrow-nudge h-4 w-4" />
            </a>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {socials.slice(0, 4).map((social) => (
                <a key={social.name} href={social.href} {...(!social.noBlank && { target: "_blank", rel: "noopener noreferrer" })} className="text-xs text-[var(--muted)] transition-colors hover:text-[var(--ink)]">
                  {social.name}
                </a>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={100}>
          <form onSubmit={submit} className="space-y-5" aria-label="Contact form">
            <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input id="website" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => setForm({ ...form, website: event.target.value })} />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-xs font-medium text-[var(--muted)]">
                Name
                <input name="name" autoComplete="name" required minLength={2} maxLength={80} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="brutal-input mt-2" placeholder="Your name" />
              </label>
              <label className="block text-xs font-medium text-[var(--muted)]">
                Email
                <input name="email" type="email" autoComplete="email" required maxLength={200} value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="brutal-input mt-2" placeholder="you@example.com" />
              </label>
            </div>

            <label className="block text-xs font-medium text-[var(--muted)]">
              Message
              <textarea name="message" required minLength={10} maxLength={4000} rows={6} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} className="brutal-input mt-2 resize-none" placeholder="A little about what you have in mind…" />
              <span className="mt-2 block text-right font-mono text-[10px] text-[var(--muted)]">{form.message.length} / 4000</span>
            </label>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button type="submit" disabled={status === "sending" || status === "sent"} className="button-primary min-w-36 disabled:cursor-not-allowed disabled:opacity-60">
                {status === "sending" ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending</> : status === "sent" ? <><Check className="h-4 w-4" /> Sent</> : <><Send className="h-4 w-4" /> Send message</>}
              </button>
              <p className="text-xs text-[var(--muted)]" role={status === "error" ? "alert" : "status"} aria-live="polite">
                {status === "sent" ? "Thanks — I’ll be in touch shortly." : status === "error" ? error : "Usually replies within 1–2 days."}
              </p>
            </div>
          </form>
        </Reveal>
      </div>
    </SectionBorder>
  );
}
