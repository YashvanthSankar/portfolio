import Link from "next/link";
import { projects } from "@/data/projects";

export function Work() {
  return (
    <section id="work" className="col section scroll-mt-8">
      <h2 className="h-section">Selected work</h2>
      <div className="mt-8 space-y-16">
        {projects.map((p) => {
          const href = p.live ?? p.github;
          return (
            <article key={p.title}>
              <h3 className="h-item">
                {href ? (
                  <a href={href} target="_blank" rel="noopener noreferrer" className="link">
                    {p.title}
                  </a>
                ) : (
                  p.title
                )}
              </h3>
              <p className="small text-muted">
                {p.kind}
                {p.year && ` · ${p.year}`}
              </p>
              <p className="mt-3">{p.description}</p>
              <p className="small mt-3 text-muted">{p.tags.join(", ")}</p>
              <p className="small mt-3 flex gap-5">
                {p.live && (
                  <a href={p.live} target="_blank" rel="noopener noreferrer" className="link">
                    Live site
                  </a>
                )}
                {p.github && (
                  <a href={p.github} target="_blank" rel="noopener noreferrer" className="link">
                    Source
                  </a>
                )}
              </p>
            </article>
          );
        })}
      </div>
      <p className="mt-12">
        <Link href="/work" className="link">
          All public repositories
        </Link>
      </p>
    </section>
  );
}
