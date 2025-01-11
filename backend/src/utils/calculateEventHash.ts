import * as crypto from 'crypto';

// Utility function to generate a hash based on event data
export function calculateEventHash(eventData: any): string {
  const hash = crypto
    .createHash('sha256')
    .update(JSON.stringify(eventData))
    .digest('hex');
  return hash;
}
