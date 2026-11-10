import { now, nowUpdated } from "@/data/now";

export function Now() {
  return (
    <section id="now" className="col section scroll-mt-8">
      <div>
        <h2 className="h-section">Now</h2>
        <p className="small text-muted tabular-nums">Updated {nowUpdated}</p>
      </div>
      <ul className="space-y-8">
        {now.map((item) => (
          <li key={item.title}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-6">
              <p className="h-item">
                {item.href ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="link">
                    {item.title}
                  </a>
                ) : (
                  item.title
                )}
              </p>
              <p className="small text-muted">{item.role}</p>
            </div>
            <p className="measure mt-2 text-muted">{item.detail}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
