import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { safeAffiliateDestination, slugSchema, sourceSchema } from '@/lib/redirect';

const allowedHosts = new Set(['amazon.in','www.amazon.in','flipkart.com','www.flipkart.com','myntra.com','www.myntra.com','ajio.com','www.ajio.com','meesho.com','www.meesho.com']);
const botPattern = /bot|crawler|spider|preview|facebookexternalhit|whatsapp|telegrambot|slackbot|discordbot/i;

export async function GET(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  if (!slugSchema.safeParse(slug).success) return NextResponse.redirect(new URL('/deals', request.url), 302);
  const deal = await prisma.deal.findFirst({ where: { slug, status: 'PUBLISHED', store: { enabled: true }, OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] }, select: { id: true, affiliateUrl: true, store: { select: { name: true } } } });
  if (!deal) return NextResponse.redirect(new URL('/deals', request.url), 302);
  const destination = safeAffiliateDestination(deal.affiliateUrl);
  if (!destination || !allowedHosts.has(destination.hostname.toLowerCase())) return NextResponse.redirect(new URL('/deals', request.url), 302);

  const source = sourceSchema.parse(request.nextUrl.searchParams.get('source') ?? 'web').toUpperCase() as 'WEB'|'WHATSAPP'|'YOUTUBE'|'TELEGRAM'|'OTHER';
  const referer = request.headers.get('referer');
  let refererHost: string | null = null;
  try { if (referer) refererHost = new URL(referer).hostname.slice(0, 253); } catch { /* ignore invalid referrer */ }
  const userAgent = request.headers.get('user-agent') ?? '';
  const botSuspected = botPattern.test(userAgent);
  // Keep redirect latency low; production should use a durable queue/outbox if analytics must never be dropped.
  if (!botSuspected) {
    void prisma.clickLog.create({ data: { dealId: deal.id, source, storeNameSnapshot: deal.store.name, refererHost, botSuspected } }).catch(() => undefined);
  }
  // Referrer policy is explicitly set; do not forward the user's full referrer to affiliate networks.
  return NextResponse.redirect(destination, { status: 302, headers: { 'Referrer-Policy': 'strict-origin-when-cross-origin', 'Cache-Control': 'no-store' } });
}
