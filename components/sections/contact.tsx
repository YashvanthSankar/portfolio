"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, Loader2, Send } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { SocialIcon } from "@/components/ui/social-icon";
import { socials } from "@/data/socials";
import { chapterNumber } from "@/data/sections";
import { EMAIL } from "@/data/site";
import { fadeUp } from "@/lib/split-reveal";
import { useMagnetic } from "@/lib/use-magnetic";

type FieldName = "name" | "email" | "message";
type Errors = Partial<Record<FieldName, string>>;

const ORDER: FieldName[] = ["name", "email", "message"];

/* Mirrors app/api/contact/route.ts. The server is still the authority —
   this only saves a round-trip to be told what we already knew. */
function validate(form: Record<FieldName, string>): Errors {
  const errors: Errors = {};
  if (form.name.trim().length < 2) errors.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
    errors.email = "That doesn't look like an email address.";
  if (form.message.trim().length < 10)
    errors.message = "A little more detail — at least 10 characters.";
  return errors;
}

export function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "", website: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const gridRef = useRef<HTMLDivElement>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const submitRef = useMagnetic<HTMLDivElement>(0.15, 5);

  useEffect(() => {
    const cleanup = fadeUp("[data-contact-el]", {
      trigger: gridRef.current,
      start: "top 82%",
      stagger: 0.08,
      y: 22,
    });
    return cleanup;
  }, []);

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    []
  );

  const resetLater = (ms: number) => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setStatus("idle"), ms);
  };

  /* Clear a field's error as soon as the reader starts fixing it —
     leaving it up while they type reads as though it's still wrong. */
  const setField =
    (key: FieldName | "website") =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = e.target;
      setForm((prev) => ({ ...prev, [key]: value }));
      if (key === "website") return;
      setErrors((prev) => {
        if (!prev[key]) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      });
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setStatus("idle");
      setErrorMsg(null);
      document.getElementById(ORDER.find((k) => found[k]) as string)?.focus();
      return;
    }

    setStatus("sending");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
          issues?: string[];
        };
        throw new Error(data.issues?.join(" · ") || data.error || "Request failed");
      }
      setStatus("sent");
      setForm({ name: "", email: "", message: "", website: "" });
      resetLater(4000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
      resetLater(5000);
    }
  };

  const field =
    "w-full rounded-[var(--radius)] border bg-[var(--bg-1)] px-4 py-3 text-sm text-[var(--text-1)] placeholder:text-[var(--text-3)] transition-colors duration-200 focus:outline-none";
  const fieldClass = (name: FieldName) =>
    `${field} ${
      errors[name]
        ? "border-[var(--accent)]"
        : "border-[var(--line-1)] focus:border-[var(--accent)]"
    }`;
  const describedBy = (name: FieldName) => (errors[name] ? `${name}-error` : undefined);

  return (
    <section
      id="contact"
      className="relative z-10 border-t border-[var(--line-1)] bg-[var(--bg-0)]"
    >
      <div className="mx-auto max-w-[var(--container)] px-[var(--gutter)] py-[var(--section-pad)]">
        <SectionHeader
          index={chapterNumber("contact")}
          label="contact"
          title={
            <>
              Got something worth <span className="serif-accent">building</span>?
            </>
          }
          description="Freelance work, full-time roles, or an idea you want a second opinion on — my inbox is open."
        />

        <div ref={gridRef} className="grid gap-12 md:grid-cols-12 md:gap-16">
          {/* Left rail */}
          <div className="md:col-span-4">
            <div data-contact-el style={{ opacity: 0 }}>
              <p className="meta mb-3">Direct</p>
              <a
                href={`mailto:${EMAIL}`}
                className="link-line tap-safe mb-10 inline-block break-all text-lg font-medium tracking-[-0.01em] text-[var(--text-1)]"
              >
                {EMAIL}
              </a>
            </div>

            <div data-contact-el className="border-t border-[var(--line-1)] pt-6" style={{ opacity: 0 }}>
              <p className="meta mb-4">Elsewhere</p>
              <ul className="space-y-3">
                {socials
                  .filter((s) => !s.noBlank)
                  .map((s) => (
                    <li key={s.name}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group tap-safe inline-flex items-center gap-3 py-1.5 text-sm text-[var(--text-2)] transition-colors duration-200 hover:text-[var(--text-1)]"
                      >
                        <span className="h-3.5 w-3.5 text-[var(--text-3)] transition-colors duration-200 group-hover:text-[var(--accent)]">
                          <SocialIcon icon={s.icon} />
                        </span>
                        {s.name}
                        <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          {/* Form */}
          <form
            data-contact-el
            onSubmit={handleSubmit}
            className="md:col-span-8"
            style={{ opacity: 0 }}
            noValidate
          >
            {/* Honeypot — hidden from users, catches bots */}
            <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
              <label htmlFor="website">Website (leave blank)</label>
              <input
                type="text"
                id="website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={setField("website")}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="meta mb-2 block">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  autoComplete="name"
                  value={form.name}
                  onChange={setField("name")}
                  placeholder="Jane Doe"
                  className={fieldClass("name")}
                  required
                  maxLength={80}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={describedBy("name")}
                />
                {errors.name && (
                  <p id="name-error" role="alert" className="meta mt-2 text-[var(--accent)]">
                    {errors.name}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="email" className="meta mb-2 block">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={setField("email")}
                  placeholder="jane@example.com"
                  className={fieldClass("email")}
                  required
                  maxLength={200}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={describedBy("email")}
                />
                {errors.email && (
                  <p id="email-error" role="alert" className="meta mt-2 text-[var(--accent)]">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-baseline justify-between">
                <label htmlFor="message" className="meta">
                  Message
                </label>
                <span className="meta tabular-nums" aria-live="polite">
                  {form.message.length} / 4000
                </span>
              </div>
              <textarea
                id="message"
                value={form.message}
                onChange={setField("message")}
                placeholder="Tell me about your project, idea, or question…"
                rows={7}
                className={`${fieldClass("message")} resize-none`}
                required
                minLength={10}
                maxLength={4000}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={describedBy("message")}
              />
              {errors.message && (
                <p id="message-error" role="alert" className="meta mt-2 text-[var(--accent)]">
                  {errors.message}
                </p>
              )}
            </div>

            {status === "error" && (
              <p
                role="alert"
                className="mt-5 rounded-[var(--radius)] border border-[var(--line-2)] bg-[var(--bg-1)] px-4 py-3 text-sm text-[var(--text-1)]"
              >
                {errorMsg || "Something went wrong. Try again."}
              </p>
            )}
            {status === "sent" && (
              <p
                role="status"
                className="mt-5 rounded-[var(--radius)] border border-[var(--accent)] bg-[var(--accent-dim)] px-4 py-3 text-sm text-[var(--text-1)]"
              >
                Message sent. I&apos;ll get back to you shortly.
              </p>
            )}

            <div className="mt-7 flex flex-wrap items-center gap-5">
              <div ref={submitRef} className="magnetic inline-flex">
                <button
                  type="submit"
                  disabled={status === "sending" || status === "sent"}
                  className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Sending
                    </>
                  ) : status === "sent" ? (
                    <>
                      <Check className="h-4 w-4" /> Sent
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" /> Send message
                    </>
                  )}
                </button>
              </div>
              <p className="meta max-w-[16rem] leading-relaxed">
                Rate-limited to 3 per hour. Protected by a honeypot, not a CAPTCHA.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
