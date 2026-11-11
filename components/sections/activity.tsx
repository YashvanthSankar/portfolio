import { getActivity } from "@/lib/github";
import { GITHUB_URL } from "@/data/site";
import repoData from "@/public/repos.json";

/* A day's character: a middle dot for nothing, then denser glyphs for
   busier days — the same ramp the hero's hands are drawn in. */
const RAMP = ":-=+*#%@";
const glyph = (count: number, max: number) =>
  count === 0 ? "·" : RAMP[Math.min(RAMP.length - 1, Math.ceil((count / max) * RAMP.length) - 1)];

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", year: "numeric" }).format(
    new Date(iso)
  );

/* When GitHub can't be reached: the most recently updated repo at build time. */
function latestRepo() {
  const repos = repoData as { name: string; url: string; updated_at: string }[];
  return repos.reduce<(typeof repos)[number] | null>(
    (a, b) => (!a || new Date(b.updated_at) > new Date(a.updated_at) ? b : a),
    null
  );
}

export async function Activity() {
  const activity = await getActivity();
  const fallback = activity?.lastPush ? null : latestRepo();
  const latest = activity?.lastPush ?? (fallback && { repo: fallback.name, url: fallback.url, date: fallback.updated_at });
  const max = Math.max(1, ...(activity?.days.map((d) => d.count) ?? []));

  return (
    <section id="activity" className="col section scroll-mt-8">
      <h2 className="h-section">Activity</h2>
      <div>
        {activity && (
          <>
            <p
              className="activity"
              role="img"
              aria-label={`${activity.total} public GitHub events in the last ${activity.days.length} days.`}
            >
              {activity.days.map((d) => (
                <span key={d.date} title={`${formatDate(d.date)}: ${d.count}`}>
                  {glyph(d.count, max)}
                </span>
              ))}
            </p>
            <p className="small measure mt-2 text-muted">
              {activity.total} public GitHub events in the last {activity.days.length} days, one character
              a day. Denser means busier.
            </p>
          </>
        )}
        {latest && (
          <p className={activity ? "mt-6" : undefined}>
            Latest push:{" "}
            <a href={latest.url} target="_blank" rel="noopener noreferrer" className="link">
              {latest.repo}
            </a>
            <span className="small ml-3 text-muted tabular-nums">{formatDate(latest.date)}</span>
          </p>
        )}
        <p className="small mt-3">
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="link">
            Profile on GitHub
          </a>
        </p>
      </div>
    </section>
  );
}
