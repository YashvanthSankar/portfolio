import { now, nowUpdated } from "@/data/now";

export function Now() {
  return (
    <section id="now" className="col mt-28 scroll-mt-8">
      <h2 className="h-section">Now</h2>
      <p className="small mt-1 text-muted">
        What I&apos;m working on this season. Updated {nowUpdated}.
      </p>
      <ul className="mt-8 space-y-8">
        {now.map((item) => (
          <li key={item.title}>
            <p className="h-item">
              {item.href ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer" className="link">
                  {item.title}
                </a>
              ) : (
                item.title
              )}
              <span className="small ml-3 font-normal text-muted">{item.role}</span>
            </p>
            <p className="mt-1 text-muted">{item.detail}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
