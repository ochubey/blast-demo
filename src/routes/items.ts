import type { FastifyInstance } from 'fastify';
import { rateLimit } from '../rateLimit';

const ITEMS = [
  { id: 1, name: 'alpha' },
  { id: 2, name: 'beta' },
];

export function registerItemRoutes(app: FastifyInstance): void {
  app.get('/api/public/items', { preHandler: rateLimit() }, async () => ITEMS);
}
