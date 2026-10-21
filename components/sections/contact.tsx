"use client";

import { useState } from "react";
import { EMAIL } from "@/data/site";

type FieldName = "name" | "email" | "message";
type Errors = Partial<Record<FieldName, string>>;

/* Mirrors app/api/contact/route.ts. The server is still the authority. */
function validate(form: Record<FieldName, string>): Errors {
  const errors: Errors = {};
  if (form.name.trim().length < 2) errors.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
    errors.email = "That doesn't look like an email address.";
  if (form.message.trim().length < 10) errors.message = "At least 10 characters, please.";
  return errors;
}

export function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "", website: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const setField =
    (key: FieldName | "website") =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = e.target;
      setForm((prev) => ({ ...prev, [key]: value }));
      if (key !== "website") setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.values(found).some(Boolean)) {
      const first = (["name", "email", "message"] as FieldName[]).find((k) => found[k]);
      if (first) document.getElementById(first)?.focus();
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
        const data = (await res.json().catch(() => ({}))) as { error?: string; issues?: string[] };
        throw new Error(data.issues?.join(" ") || data.error || "Request failed");
      }
      setStatus("sent");
      setForm({ name: "", email: "", message: "", website: "" });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="col mt-28 scroll-mt-8">
      <h2 className="h-section">Contact</h2>
      <p className="mt-3 text-muted">
        Freelance work, full-time roles, or an idea you want a second opinion on. Write
        here or email{" "}
        <a href={`mailto:${EMAIL}`} className="link text-ink">
          {EMAIL}
        </a>
        .
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 max-w-[34rem] space-y-5">
        {/* Honeypot — hidden from people, filled by bots */}
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

        <div>
          <label htmlFor="name" className="small mb-1.5 block">
            Name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={setField("name")}
            className="field"
            maxLength={80}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <p id="name-error" role="alert" className="small mt-1.5 text-muted">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="small mb-1.5 block">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={setField("email")}
            className="field"
            maxLength={200}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" role="alert" className="small mt-1.5 text-muted">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="small mb-1.5 block">
            Message
          </label>
          <textarea
            id="message"
            rows={6}
            value={form.message}
            onChange={setField("message")}
            className="field resize-y"
            maxLength={4000}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "message-error" : undefined}
          />
          {errors.message && (
            <p id="message-error" role="alert" className="small mt-1.5 text-muted">
              {errors.message}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <button type="submit" disabled={status === "sending" || status === "sent"} className="btn">
            {status === "sending" ? "Sending…" : status === "sent" ? "Sent" : "Send message"}
          </button>
          {status === "sent" && (
            <p role="status" className="small">
              Thanks — I&apos;ll reply soon.
            </p>
          )}
          {status === "error" && (
            <p role="alert" className="small">
              {errorMsg}
            </p>
          )}
        </div>
      </form>
    </section>
  );
}
