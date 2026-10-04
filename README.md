# blast-demo

A tiny Fastify service used to demo the **Blast Radius** of [DevDigest](https://github.com/ochubey/dev-digest-learning).

It is built so that a change to the shared rate limiter (`src/rateLimit.ts`) has a visible blast radius:

- `rateLimit()` / `bucketKey()` are used by the public routes and the server hook (callers),
- those routes register HTTP endpoints (`GET /api/public/items`, `POST /api/public/webhooks`, ...),
- `resetBuckets()` is called by an hourly cron job (`src/jobs/resetRateBuckets.ts`).

Nothing here is meant to be run in production.
