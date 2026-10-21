import { experience } from "@/data/experience";

export function ExperienceSection() {
  return (
    <section id="experience" className="col section scroll-mt-8">
      <h2 className="h-section">Experience</h2>
      <ul className="mt-8 space-y-10">
        {experience.map((item) => (
          <li key={item.title} className="grid gap-1 sm:grid-cols-[7rem_1fr] sm:gap-6">
            <p className="small text-muted tabular-nums">{item.period}</p>
            <div>
              <p className="h-item">{item.title}</p>
              {item.organization && <p className="text-muted">{item.organization}</p>}
              <p className="mt-2">{item.description}</p>
              {item.bullets && (
                <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
                  {item.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
              {item.tags && <p className="small mt-2 text-muted">{item.tags.join(", ")}</p>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
