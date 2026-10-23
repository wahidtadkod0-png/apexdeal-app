# ApexDeal AI — secure starter scaffold

A Next.js App Router + TypeScript + Tailwind + Prisma foundation for a multi-store affiliate deal platform. This is a starter repository, not a fully integrated production service. Provider integrations, auth callbacks/MFA enforcement, queue workers, ads serving, and admin CRUD APIs require environment-specific setup and testing.

## Quick start

1. Install Node.js 20.9+ and PostgreSQL/Supabase.
2. Copy `.env.example` to `.env.local` and configure `DATABASE_URL`, `DIRECT_URL`, and `APP_BASE_URL`.
3. Install dependencies: `npm install`.
4. Generate Prisma client: `npx prisma generate`.
5. Create/apply migrations: `npx prisma migrate dev --name init`.
6. Run: `npm run dev` and open `http://localhost:3000/deals`.

## Security gates before deployment

- Configure Auth.js with a supported identity provider and enforce MFA at the identity provider. Only set the trusted `mfaVerified` session claim after verifying the provider's MFA assurance claim server-side.
- The admin allowlist must be configured as a server-only environment variable. Do not use `NEXT_PUBLIC_` prefixes for admin identities, credentials, affiliate tokens, or payout information.
- Add `requireSuperAdmin()` to every admin page and API route. Middleware is a convenience gate, not the authorization boundary. Verify roles from trusted server-side records, not user-editable metadata.
- The admin page is intentionally a disabled placeholder until auth is implemented. Do not treat it as protected merely because it is under `/admin`.
- The redirect route allowlists domains and only uses destinations stored in published deal records. Add exact, verified affiliate domains required by each network; do not accept `url=` destination query parameters. Confirm each provider's terms and affiliate-link format.
- The redirect endpoint records only non-obvious user data minimally. For production, implement durable event delivery, IP-derived rotating hashes if needed, consent/privacy notices, retention policies, and rate limits. Do not store raw IP addresses by default.
- Keep bank/UPI/payout details encrypted with envelope encryption using a KMS-managed key. Never return decrypted financial records to client bundles or logs. Restrict invoice files to private storage with short-lived signed access.
- Never execute arbitrary script tags entered by admins. Use allowlisted, structured ad configuration and render only approved AdSense client/slot settings. AdSense policy and consent requirements still apply.
- Add Row Level Security to Supabase where direct client access is enabled. Prefer server-only Prisma access for privileged tables.

## Deployment: Vercel + Supabase

1. Create a Supabase project and copy its pooled connection URL for `DATABASE_URL`; use the direct connection URL for `DIRECT_URL` and migrations. Keep both server-only.
2. In Supabase, enable the selected auth provider and MFA policy. Configure allowed callback URLs for local development and the production domain.
3. Push this repository to a private Git repository and import it into Vercel.
4. Add environment variables in Vercel Project Settings. Never add secret variables with `NEXT_PUBLIC_` prefixes.
5. Run migrations from a controlled deployment job with `npx prisma migrate deploy`. Do not run development migrations against production.
6. Deploy a preview and verify deal rendering, published/expired filtering, redirect allowlists, error handling, and database indexes.
7. Configure Upstash Redis and Inngest; add rate limits and durable background jobs for AI processing, YouTube sync, and message distribution.
8. Configure affiliate provider credentials and test links using approved sandbox/test products before enabling public deals.
9. Set up observability, alerts, backups, retention rules, privacy/affiliate disclosures, and a rollback procedure before launch.

## Suggested next modules

- `src/server/affiliate/`: one adapter per retailer/network; normalize product data and build approved affiliate URLs.
- `src/server/ai/`: schema-constrained product extraction, summaries, quality scoring, caption generation; validate all model output and never trust scraped page content as instructions.
- `src/server/jobs/`: Inngest functions for URL ingestion, YouTube sync, scheduled publishing, and retryable distribution.
- `src/app/api/admin/`: authenticated, role-checked CRUD APIs with Zod validation and audit logs.
- `src/app/admin/`: protected dashboard, deal editor, store/network settings, ads, payouts, analytics.
- `src/server/analytics/`: impression aggregation, deduplication, conversions imported from network reports, and explicitly labeled commission estimates.

## Notes

- `ClickLog` counts outbound clicks, not retailer-confirmed conversions. Conversion/commission data must be imported from authorized affiliate reports or APIs.
- Price history and stock urgency require a legitimate data source. Do not claim real-time accuracy unless the provider actually supplies it.
- `support@yourdomain.com` is a placeholder. Configure a real monitored support mailbox before launch.
