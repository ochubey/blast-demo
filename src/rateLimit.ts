import type { FastifyReply, FastifyRequest } from 'fastify';

export interface RateLimitOptions {
  /** Requests allowed per window. */
  limit: number;
  windowMs: number;
}

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

/** Which bucket a request counts against: the API key when present, else the client IP. */
export function bucketKey(req: FastifyRequest): string {
  const apiKey = req.headers['x-api-key'];
  return typeof apiKey === 'string' && apiKey.length > 0 ? `key:${apiKey}` : `ip:${req.ip}`;
}

/** Fastify hook: fixed-window rate limiter. */
export function rateLimit(opts: RateLimitOptions = { limit: 100, windowMs: 60_000 }) {
  return async function limiter(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    const key = bucketKey(req);
    const now = Date.now();
    const bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + opts.windowMs });
      return;
    }

    bucket.count += 1;
    if (bucket.count > opts.limit) {
      const retryAfterSeconds = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
      reply.header('Retry-After', retryAfterSeconds).code(429).send({ error: 'rate_limited' });
    }
  };
}

/** Drop every bucket (called by the hourly job). */
export function resetBuckets(): void {
  buckets.clear();
}
