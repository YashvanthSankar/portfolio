import { Resend } from "resend";
import { NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

const ContactSchema = z.object({
  name: z.string().trim().min(2, "Name too short").max(80, "Name too long"),
  email: z.string().trim().email("Invalid email").max(200),
  message: z.string().trim().min(10, "Message too short").max(4000, "Message too long"),
  /* Honeypot — must be empty. Hidden from real users via CSS. */
  website: z.string().max(0).optional().or(z.literal("")),
});

export async function POST(req: Request) {
  const ip = getClientIp(req.headers);
  const limit = rateLimit(`contact:${ip}`, { limit: 3, windowMs: 60 * 60 * 1000 });

  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many messages. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((limit.resetAt - Date.now()) / 1000)),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = ContactSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues.map((i) => i.message) },
      { status: 400 }
    );
  }

  /* Silent drop for bot submissions hitting the honeypot. */
  if (parsed.data.website) {
    return NextResponse.json({ success: true });
  }

  const { name, email, message } = parsed.data;

  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY missing");
    return NextResponse.json({ error: "Email service unavailable" }, { status: 503 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: "Portfolio Contact <contact@yashvanth.com>",
    to: "yashvanthsankar@gmail.com",
    replyTo: email,
    subject: `Portfolio message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: "Failed to send" }, { status: 502 });
  }

  return NextResponse.json(
    { success: true },
    { headers: { "X-RateLimit-Remaining": String(limit.remaining) } }
  );
}
