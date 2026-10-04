import Fastify from 'fastify';
import type { FastifyInstance } from 'fastify';
import { scheduleResetRateBuckets } from './jobs/resetRateBuckets';
import { rateLimit } from './rateLimit';
import { registerAdminRoutes } from './routes/admin';
import { registerHealthRoutes } from './routes/health';
import { registerItemRoutes } from './routes/items';
import { registerWebhookRoutes } from './routes/webhooks';

export function buildServer(): FastifyInstance {
  const app = Fastify();
  app.addHook('onRequest', rateLimit());
  registerItemRoutes(app);
  registerWebhookRoutes(app);
  registerHealthRoutes(app);
  registerAdminRoutes(app);
  scheduleResetRateBuckets();
  return app;
}

if (require.main === module) {
  buildServer().listen({ port: 3000 });
}
