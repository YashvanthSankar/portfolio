import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Palette · Yashvanth S",
  description: "The minimal monochrome token system used across the portfolio.",
};

interface Token {
  name: string;
  css: string;
  label: string;
}

const lightTokens: Token[] = [
  { name: "paper", css: "#FCFCFC", label: "Page background" },
  { name: "surface", css: "#FFFFFF", label: "Card fill" },
  { name: "surface-hover", css: "#F4F4F5", label: "Hover fill / chips" },
  { name: "line", css: "#E9E9EC", label: "Hairline borders" },
  { name: "line-strong", css: "#D6D6DB", label: "Hover borders" },
  { name: "faint", css: "#A6A6AE", label: "Tertiary text" },
  { name: "muted", css: "#6F6F78", label: "Secondary text" },
  { name: "ink", css: "#111113", label: "Primary text" },
];

const darkTokens: Token[] = [
  { name: "paper", css: "#0A0A0B", label: "Page background" },
  { name: "surface", css: "#101012", label: "Card fill" },
  { name: "surface-hover", css: "#19191C", label: "Hover fill / chips" },
  { name: "line", css: "#1F1F23", label: "Hairline borders" },
  { name: "line-strong", css: "#2D2D33", label: "Hover borders" },
  { name: "faint", css: "#5D5D66", label: "Tertiary text" },
  { name: "muted", css: "#9C9CA3", label: "Secondary text" },
  { name: "ink", css: "#F2F2F3", label: "Primary text" },
];

function isDark(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 140;
}

function Swatch({ name, css, label }: Token) {
  const dark = isDark(css);
  return (
    <div className="card overflow-hidden">
      <div className="flex h-24 w-full items-end p-3" style={{ backgroundColor: css }}>
        <span
          className="rounded-md px-1.5 py-0.5 font-mono text-[10px] font-medium"
          style={{
            color: dark ? "#F2F2F3" : "#111113",
            backgroundColor: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
          }}
        >
          {css.toUpperCase()}
        </span>
      </div>
      <div className="border-t border-line px-3 py-2.5">
        <p className="truncate text-sm font-medium text-ink">--{name}</p>
        <p className="mt-0.5 truncate font-mono text-[10px] text-faint">{label}</p>
      </div>
    </div>
  );
}

function Group({ title, tokens }: { title: string; tokens: Token[] }) {
  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-faint">
          {title}
        </h2>
        <div className="h-px flex-1 bg-line" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {tokens.map((t) => (
          <Swatch key={t.name} {...t} />
        ))}
      </div>
    </div>
  );
}

export default function PalettePage() {
  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-40 border-b border-line bg-paper/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm text-muted transition-colors duration-200 hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Back
          </Link>
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
            Palette
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 pb-12 pt-20">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-faint">
          Design system
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink md:text-5xl">
          Monochrome palette.
        </h1>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">
          No hue. Two anchors and a short grayscale ramp do everything color
          used to — depth comes from contrast, weight, and rhythm, not chroma.
        </p>
      </div>

      <div className="mx-auto max-w-5xl space-y-16 px-6 pb-24">
        <Group title="Light — :root" tokens={lightTokens} />
        <Group title="Dark — .dark" tokens={darkTokens} />
      </div>
    </div>
  );
}
