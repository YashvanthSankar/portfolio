import { GITHUB_URL } from "@/data/site";

const USER = GITHUB_URL.split("/").pop() ?? "";
const DAYS = 30; // the events API reaches back about this far
const TIME_ZONE = "Asia/Kolkata";

export interface Activity {
  /** Oldest first, one entry per day, ending today. */
  days: { date: string; count: number }[];
  total: number;
  lastPush: { repo: string; url: string; date: string } | null;
}

interface GitHubEvent {
  type: string;
  created_at: string;
  repo: { name: string };
}

const dayKey = (d: Date) => new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(d);

/**
 * Public GitHub activity for the last 30 days, from the events API. Cached
 * for an hour. Returns null when GitHub can't be reached or the anonymous
 * rate limit is spent (set GITHUB_TOKEN to lift it); callers fall back to
 * the build-time repos.json.
 */
export async function getActivity(): Promise<Activity | null> {
  const token = process.env.GITHUB_TOKEN;
  try {
    const events: GitHubEvent[] = [];
    for (let page = 1; page <= 3; page++) {
      const res = await fetch(`https://api.github.com/users/${USER}/events/public?per_page=100&page=${page}`, {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "portfolio-site",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) throw new Error(`GitHub responded ${res.status}`);
      const batch = (await res.json()) as GitHubEvent[];
      events.push(...batch);
      if (batch.length < 100) break;
    }

    const counts = new Map<string, number>();
    for (const e of events) {
      const key = dayKey(new Date(e.created_at));
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    const now = Date.now();
    const days = Array.from({ length: DAYS }, (_, i) => {
      const date = dayKey(new Date(now - (DAYS - 1 - i) * 86_400_000));
      return { date, count: counts.get(date) ?? 0 };
    });

    const push = events.find((e) => e.type === "PushEvent");
    return {
      days,
      total: days.reduce((sum, d) => sum + d.count, 0),
      lastPush: push
        ? {
            repo: push.repo.name.replace(`${USER}/`, ""),
            url: `https://github.com/${push.repo.name}`,
            date: push.created_at,
          }
        : null,
    };
  } catch {
    return null;
  }
}
