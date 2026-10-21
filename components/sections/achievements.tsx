import { achievements } from "@/data/achievements";

export function Achievements() {
  return (
    <section id="achievements" className="col section scroll-mt-8">
      <h2 className="h-section">Achievements</h2>
      <ul className="mt-8 space-y-8">
        {achievements.map((a) => (
          <li key={a.title} className="grid gap-1 sm:grid-cols-[8.5rem_1fr] sm:gap-6">
            <p className="small text-muted tabular-nums">{a.year}</p>
            <div>
              <p className="h-item">
                {a.href ? (
                  <a href={a.href} target="_blank" rel="noopener noreferrer" className="link">
                    {a.title}
                  </a>
                ) : (
                  a.title
                )}
              </p>
              <p className="mt-1 text-muted">{a.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
