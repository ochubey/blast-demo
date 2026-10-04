import type { FastifyInstance } from 'fastify';
import { bucketKey } from '../rateLimit';

export function registerAdminRoutes(app: FastifyInstance): void {
  app.get('/api/admin/whoami', async (req) => ({ bucket: bucketKey(req) }));
}
