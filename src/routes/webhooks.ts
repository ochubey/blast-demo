import type { FastifyInstance } from 'fastify';
import { rateLimit } from '../rateLimit';

export function registerWebhookRoutes(app: FastifyInstance): void {
  app.post('/api/public/webhooks', { preHandler: rateLimit({ limit: 20, windowMs: 60_000 }) }, async (req) => {
    return { received: true, bytes: JSON.stringify(req.body ?? {}).length };
  });
}
