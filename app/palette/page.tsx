import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Palette · Yashvanth S",
  description: "The minimal three-color system used across the portfolio.",
};

interface Token {
  name: string;
  css: string;
  display: string;
  label: string;
}

const lightTokens: Token[] = [
  { name: "paper", css: "#FAFAFA", display: "#FAFAFA", label: "Page background" },
  { name: "surface", css: "#FFFFFF", display: "#FFFFFF", label: "Card fill" },
  { name: "surface-alt", css: "#F0F0F2", display: "#F0F0F2", label: "Alt surface / hover" },
  { name: "muted", css: "#6B6B70", display: "#6B6B70", label: "Muted text" },
  { name: "ink", css: "#0B0B0C", display: "#0B0B0C", label: "Text & borders, near black" },
  { name: "accent", css: "#0B0B0C", display: "#0B0B0C", label: "Accent, inverted ink block" },
];

const darkTokens: Token[] = [
  { name: "paper", css: "#0B0B0C", display: "#0B0B0C", label: "Page background" },
  { name: "surface", css: "#141416", display: "#141416", label: "Card fill" },
  { name: "surface-alt", css: "#1C1C1F", display: "#1C1C1F", label: "Alt surface / hover" },
  { name: "muted", css: "#9A9AA0", display: "#9A9AA0", label: "Muted text" },
  { name: "ink", css: "#FAFAFA", display: "#FAFAFA", label: "Text + borders" },
  { name: "accent", css: "#FAFAFA", display: "#FAFAFA", label: "Accent, inverted ink block" },
];

function isDark(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 140;
}

function Swatch({ name, css, display, label }: Token) {
  const dark = isDark(css);
  return (
    <div className="border-[2.5px] border-[var(--border-ink)] shadow-brutal bg-[var(--surface)]">
      <div className="h-28 w-full flex items-end p-3" style={{ backgroundColor: css }}>
        <span
          className="font-mono text-[10px] tracking-wide px-1.5 py-0.5 border-2 border-[var(--border-ink)] font-bold"
          style={{
            color: dark ? "#FAFAFA" : "#0B0B0C",
            backgroundColor: dark ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.75)",
          }}
        >
          {display.toUpperCase()}
        </span>
      </div>
      <div className="px-3 py-2 border-t-[2.5px] border-[var(--border-ink)]">
        <p className="font-display font-bold text-sm truncate">--{name}</p>
        <p className="font-mono text-[10px] text-[var(--muted)] truncate">{label}</p>
      </div>
    </div>
  );
}

function Group({ title, tokens }: { title: string; tokens: Token[] }) {
  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <h2 className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--accent)] text-[var(--accent-ink)] border-[2.5px] border-[var(--border-ink)] shadow-[3px_3px_0_0_var(--border-ink)] font-display font-bold text-xs tracking-[0.22em] uppercase -rotate-sticker-1">
          {title}
        </h2>
        <div className="flex-1 h-[2.5px] bg-[var(--border-ink)]" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {tokens.map((t) => (
          <Swatch key={t.name} {...t} />
        ))}
      </div>
    </div>
  );
}

export default function PalettePage() {
  return (
    <div className="min-h-screen bg-brutal-grid">
      <div className="sticky top-0 z-40 border-b-[2.5px] border-[var(--border-ink)] bg-[var(--paper)]">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3 py-1.5 border-2 border-[var(--border-ink)] bg-[var(--surface)] font-display font-bold text-sm shadow-[3px_3px_0_0_var(--border-ink)] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[4px_4px_0_0_var(--border-ink)] transition-transform duration-150"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </Link>
          <span className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase">palette · visualizer</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-10 pt-16 pb-12">
        <div className="relative bg-[var(--surface)] border-[2.5px] border-[var(--border-ink)] shadow-brutal-lg p-10 sm:p-14">
          <span className="absolute -top-3 -left-3 px-3 py-1 bg-[var(--accent)] text-[var(--accent-ink)] border-[2.5px] border-[var(--border-ink)] shadow-[3px_3px_0_0_var(--border-ink)] font-display font-bold text-xs tracking-[0.22em] uppercase -rotate-sticker-2">
            {"// design system"}
          </span>
          <h1 className="font-display font-bold text-[clamp(3rem,10vw,7rem)] leading-[0.9] tracking-[-0.05em] text-[var(--ink)] mb-6">
            Monochrome
            <br />
            <span className="inline-block bg-[var(--accent)] text-[var(--accent-ink)] border-[3px] border-[var(--border-ink)] shadow-[8px_8px_0_0_var(--border-ink)] px-4 -rotate-1">
              palette.
            </span>
          </h1>
          <p className="max-w-md text-base text-[var(--muted)] leading-relaxed">
            No hue. A five-step grayscale ramp does everything color used to.
            Depth comes from contrast, weight, and rhythm, not chroma.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-10 pb-24 space-y-16">
        <Group title="Light mode :root" tokens={lightTokens} />
        <Group title="Dark mode .dark" tokens={darkTokens} />
      </div>
    </div>
  );
}
