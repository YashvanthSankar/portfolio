import { achievements } from "@/data/achievements";

export function Achievements() {
  return (
    <section id="achievements" className="col section scroll-mt-8">
      <h2 className="h-section">Achievements</h2>
      <ul className="space-y-8">
        {achievements.map((a) => (
          <li key={a.title}>
            <div className="grid gap-x-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline">
              <p className="h-item measure">
                {a.href ? (
                  <a href={a.href} target="_blank" rel="noopener noreferrer" className="link">
                    {a.title}
                  </a>
                ) : (
                  a.title
                )}
              </p>
              <p className="small text-muted tabular-nums">{a.year}</p>
            </div>
            <p className="measure mt-2 text-muted">{a.detail}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
