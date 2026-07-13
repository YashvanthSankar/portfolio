import type { Metadata } from "next";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Design system",
  description: "The restrained monochrome design system behind the portfolio.",
};

const light = [
  ["Paper", "#F7F7F5", "Page background"],
  ["Surface", "#FFFFFF", "Raised content"],
  ["Ink", "#111111", "Type and emphasis"],
  ["Muted", "#6F6F69", "Secondary type"],
];

const dark = [
  ["Paper", "#0D0D0D", "Page background"],
  ["Surface", "#141414", "Raised content"],
  ["Ink", "#F4F4F1", "Type and emphasis"],
  ["Muted", "#969690", "Secondary type"],
];

function Swatches({ title, colors }: { title: string; colors: string[][] }) {
  return (
    <Reveal>
      <h2 className="mb-5 text-sm font-semibold">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {colors.map(([name, value, use]) => (
          <div key={name} className="overflow-hidden rounded-2xl border border-[var(--border-ink)] bg-[var(--surface)]">
            <div className="h-36" style={{ backgroundColor: value }} />
            <div className="border-t border-[var(--border-ink)] p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold">{name}</span>
                <span className="font-mono text-[10px] text-[var(--muted)]">{value}</span>
              </div>
              <p className="mt-1 text-xs text-[var(--muted)]">{use}</p>
            </div>
          </div>
        ))}
      </div>
    </Reveal>
  );
}

export default function PalettePage() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <section className="site-container py-16 md:py-24">
          <Reveal>
            <span className="eyebrow">Design system</span>
            <h1 className="mt-6 max-w-[12ch] text-[clamp(3.5rem,8vw,7rem)] font-medium leading-[0.94] tracking-[-0.07em]">Quiet by design.</h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-[var(--muted)]">
              A neutral palette, measured spacing, and motion that supports attention instead of competing for it.
            </p>
          </Reveal>
        </section>
        <section className="section-shell">
          <div className="site-container space-y-16">
            <Swatches title="Light" colors={light} />
            <Swatches title="Dark" colors={dark} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
