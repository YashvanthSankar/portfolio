import Image from "next/image";
import Link from "next/link";
import { projects } from "@/data/projects";

export function Work() {
  return (
    <section id="work" className="col section scroll-mt-8">
      <h2 className="h-section">Selected work</h2>
      <div>
        <div className="space-y-12">
          {projects.map((p) => {
            const href = p.live ?? p.github;
            return (
              <article key={p.title}>
                <div className="flex items-baseline justify-between gap-6">
                  <h3 className="h-item">
                    {href ? (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="link">
                        {p.title}
                      </a>
                    ) : (
                      p.title
                    )}
                  </h3>
                  {p.year && <p className="small text-muted tabular-nums">{p.year}</p>}
                </div>
                {p.kind && <p className="small text-muted">{p.kind}</p>}
                {p.image && (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={-1}
                    aria-hidden="true"
                    className="shot mt-4 block"
                  >
                    <Image
                      src={p.image}
                      alt=""
                      width={1200}
                      height={750}
                      sizes="(max-width: 800px) 100vw, 784px"
                      className="block h-auto w-full"
                    />
                  </a>
                )}
                <p className="measure mt-3">{p.description}</p>
                <p className="small measure mt-3 text-muted">{p.tags.join(", ")}</p>
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
      </div>
    </section>
  );
}
