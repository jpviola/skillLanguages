// Layer 5 — Minimal in-memory rate limiter keyed by device id.
// (For multi-instance production, swap for Upstash Redis / Vercel KV-equivalent.)
const WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000);
const MAX = Number(process.env.RATE_LIMIT_MAX_REQUESTS || 10);

const hits = new Map<string, number[]>();

export function rateLimit(key: string): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const arr = (hits.get(key) || []).filter((t) => now - t < WINDOW_MS);
  if (arr.length >= MAX) {
    const retryAfter = Math.ceil((WINDOW_MS - (now - arr[0])) / 1000);
    return { ok: false, retryAfter };
  }
  arr.push(now);
  hits.set(key, arr);
  return { ok: true, retryAfter: 0 };
}
