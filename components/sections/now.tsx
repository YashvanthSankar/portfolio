import { now, nowUpdated } from "@/data/now";
import repoData from "@/public/repos.json";

/* The most recently pushed public repo, as of the last `npm run repos`. */
const latest = (repoData as Array<{ name: string; url: string; updated_at: string }>)
  .slice()
  .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0];

const monthYear = (date: string) =>
  new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(new Date(date));

export function Now() {
  return (
    <section id="now" className="col section scroll-mt-8">
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
      {latest && (
        <p className="small mt-8 text-muted">
          Latest on GitHub:{" "}
          <a href={latest.url} target="_blank" rel="noopener noreferrer" className="link">
            {latest.name}
          </a>
          , {monthYear(latest.updated_at)}.
        </p>
      )}
    </section>
  );
}
