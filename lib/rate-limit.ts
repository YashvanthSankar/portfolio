/**
 * In-memory fixed-window rate limiter. Keyed by client IP.
 *
 * On Vercel Fluid Compute a function instance is reused across concurrent
 * invocations, so this Map persists between requests on the same instance.
 * It is NOT shared across regions/instances — for a small personal portfolio
 * this is an acceptable trade-off vs. pulling in Redis. If abuse is observed,
 * swap in @upstash/ratelimit.
 */
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const SWEEP_AFTER = 50;
let writes = 0;

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number }
): { ok: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || entry.resetAt < now) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    maybeSweep(now);
    return { ok: true, remaining: limit - 1, resetAt };
  }

  if (entry.count >= limit) {
    return { ok: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return { ok: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

function maybeSweep(now: number) {
  writes += 1;
  if (writes < SWEEP_AFTER) return;
  writes = 0;
  for (const [k, v] of buckets) {
    if (v.resetAt < now) buckets.delete(k);
  }
}

export function getClientIp(headers: Headers): string {
  const xff = headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return headers.get("x-real-ip") || headers.get("cf-connecting-ip") || "unknown";
}
