import { z } from 'zod';
export const slugSchema = z.string().min(1).max(100).regex(/^[a-zA-Z0-9_-]+$/);
export const sourceSchema = z.enum(['web','whatsapp','youtube','telegram','other']).catch('other');

/** Only redirect to an affiliate URL loaded from a published Deal record. Never accept a destination URL from query params. */
export function safeAffiliateDestination(value: string): URL | null {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return null;
    if (url.username || url.password) return null;
    return url;
  } catch { return null; }
}
