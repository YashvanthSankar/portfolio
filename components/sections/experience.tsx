import { experience } from "@/data/experience";

export function ExperienceSection() {
  return (
    <section id="experience" className="col section scroll-mt-8">
      <h2 className="h-section">Experience</h2>
      <ul className="space-y-10">
        {experience.map((item) => (
          <li key={item.title}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-6">
              <p className="h-item">{item.title}</p>
              <p className="small text-muted tabular-nums">{item.period}</p>
            </div>
            {item.organization && <p className="small text-muted">{item.organization}</p>}
            <p className="measure mt-3">{item.description}</p>
            {item.bullets && (
              <ul className="measure mt-2 list-disc space-y-1 pl-5 text-muted">
                {item.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
            {item.tags && <p className="small measure mt-3 text-muted">{item.tags.join(", ")}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}
