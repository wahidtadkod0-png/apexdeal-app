import { ShieldAlert } from 'lucide-react';
export default function AdminPage() {
  // IMPORTANT: Replace with the server-side authenticated session + requireSuperAdmin guard before enabling admin functionality.
  return <main className="mx-auto max-w-2xl p-8"><div className="rounded-2xl border border-amber-300 bg-amber-50 p-6"><ShieldAlert className="text-amber-700"/><h1 className="mt-3 text-2xl font-black">Admin authentication not configured</h1><p className="mt-2 text-sm leading-6 text-amber-900">This starter intentionally does not expose an admin dashboard until identity-provider configuration, MFA verification, role assignment, and server-side authorization are completed. Do not deploy this route as an active admin console.</p></div></main>;
}
