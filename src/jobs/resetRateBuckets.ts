import cron from 'node-cron';
import { resetBuckets } from '../rateLimit';

/** Hourly: clear the in-memory rate-limit buckets. */
export function scheduleResetRateBuckets(): void {
  cron.schedule('0 * * * *', () => resetBuckets());
}
