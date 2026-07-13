import { SectionBorder } from "@/components/ui/section-border";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";

const stats = [
  ["15+", "Things shipped"],
  ["20+", "Tools in the stack"],
  ["9.27", "Current GPA"],
  ["4+", "Years building"],
];

export function AboutBento() {
  return (
    <SectionBorder id="about">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <SectionHeader
          label="03 / About"
          title="Curious by default. Precise by choice."
          className="mb-0"
        />
        <div>
          <Reveal>
            <p className="max-w-2xl text-xl leading-[1.55] tracking-[-0.025em] md:text-2xl">
              I&apos;m a computer science student at IIITDM Kancheepuram, co-founder at Denoise Labs, and a developer who likes making complex systems feel simple.
            </p>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--muted)]">
              My work sits between product engineering and applied AI. I care about clear interfaces, dependable backends, and the small interactions that make software feel considered.
            </p>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 border-y border-[var(--border-ink)] sm:grid-cols-4">
            {stats.map(([value, label], index) => (
              <Reveal key={label} delay={index * 40} className="py-6 pr-4">
                <strong className="block text-2xl font-medium tracking-[-0.04em]">{value}</strong>
                <span className="mt-1 block text-xs text-[var(--muted)]">{label}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </SectionBorder>
  );
}
