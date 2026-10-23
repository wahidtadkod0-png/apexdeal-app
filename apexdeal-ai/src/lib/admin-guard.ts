import 'server-only';
import { redirect } from 'next/navigation';

/** Call from every admin page and every admin API handler. Middleware alone is not authorization. */
export async function requireSuperAdmin(session: { user?: { email?: string | null; role?: string; mfaVerified?: boolean } } | null) {
  const allowed = (process.env.ADMIN_EMAIL_ALLOWLIST ?? '').split(',').map(v => v.trim().toLowerCase()).filter(Boolean);
  const email = session?.user?.email?.toLowerCase();
  if (!email || !allowed.includes(email) || session?.user?.role !== 'SUPERADMIN' || session?.user?.mfaVerified !== true) {
    redirect('/api/auth/signin');
  }
}
