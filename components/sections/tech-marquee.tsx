import { technologyCategories } from "@/data/technologies";
import { SectionBorder } from "@/components/ui/section-border";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";

export function TechMarquee() {
  return (
    <SectionBorder id="technologies">
      <SectionHeader
        label="02 / Toolkit"
        title="A practical stack for shipping."
        description="The technologies I use most often, chosen for the problem rather than the trend."
      />
      <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
        {technologyCategories.map((category, index) => (
          <Reveal key={category.title} delay={index * 50}>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">{category.title}</h3>
            <ul className="space-y-2.5">
              {category.items.slice(0, 7).map((item) => (
                <li key={item.name} className="text-sm tracking-[-0.01em]">{item.name}</li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </SectionBorder>
  );
}
