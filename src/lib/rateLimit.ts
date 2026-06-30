// Layer 5 — Rate limiter with Upstash Redis for production,
// in-memory fallback for local development.
// Multi-instance safe: Redis persists across Vercel edge functions.
import { Redis } from "@upstash/redis";

const WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000);
const MAX = Number(process.env.RATE_LIMIT_MAX_REQUESTS || 10);

// Upstash Redis client — only created when credentials are present.
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

// In-memory fallback (resets on cold start — fine for local dev).
const memoryHits = new Map<string, number[]>();

export async function rateLimit(key: string): Promise<{ ok: boolean; retryAfter: number }> {
  const now = Date.now();

  if (redis) {
    return rateLimitRedis(key, now);
  }
  return rateLimitMemory(key, now);
}

function rateLimitMemory(key: string, now: number): { ok: boolean; retryAfter: number } {
  const arr = (memoryHits.get(key) || []).filter((t) => now - t < WINDOW_MS);
  if (arr.length >= MAX) {
    const retryAfter = Math.ceil((WINDOW_MS - (now - arr[0])) / 1000);
    return { ok: false, retryAfter };
  }
  arr.push(now);
  memoryHits.set(key, arr);
  return { ok: true, retryAfter: 0 };
}

async function rateLimitRedis(key: string, now: number): Promise<{ ok: boolean; retryAfter: number }> {
  const windowKey = `rl:${key}:${Math.floor(now / WINDOW_MS)}`;
  try {
    const count = await redis!.incr(windowKey);
    if (count === 1) {
      await redis!.expire(windowKey, Math.ceil(WINDOW_MS / 1000) + 1);
    }
    if (count > MAX) {
      const ttl = await redis!.ttl(windowKey);
      return { ok: false, retryAfter: Math.max(1, ttl) };
    }
    return { ok: true, retryAfter: 0 };
  } catch (err) {
    console.error("[rateLimit] Redis error, falling back to allow:", err);
    return { ok: true, retryAfter: 0 };
  }
}