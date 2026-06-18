// Simple in-memory rate limiter (per-IP, fixed window).
// Good enough for a single-instance deployment / MVP. For multi-instance
// production, swap the Map for a shared store (Upstash Redis, etc.) behind
// this same interface.

interface Window {
  count: number
  resetAt: number
}

const WINDOW_MS = 60_000 // 1 minute
const MAX_REQUESTS = 10 // per IP per window

const hits = new Map<string, Window>()

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
}

export function rateLimit(key: string): RateLimitResult {
  const now = Date.now()
  const existing = hits.get(key)

  if (!existing || now >= existing.resetAt) {
    const resetAt = now + WINDOW_MS
    hits.set(key, { count: 1, resetAt })
    return { allowed: true, remaining: MAX_REQUESTS - 1, resetAt }
  }

  existing.count += 1
  const allowed = existing.count <= MAX_REQUESTS
  return {
    allowed,
    remaining: Math.max(0, MAX_REQUESTS - existing.count),
    resetAt: existing.resetAt,
  }
}

// Opportunistically drop expired windows so the Map doesn't grow unbounded.
export function pruneRateLimits(): void {
  const now = Date.now()
  for (const [key, win] of hits) {
    if (now >= win.resetAt) hits.delete(key)
  }
}
