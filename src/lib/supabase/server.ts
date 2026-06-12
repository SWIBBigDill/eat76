import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client.
 *
 * Prefers the secret key (SUPABASE_SECRET_KEY or legacy SUPABASE_SERVICE_ROLE_KEY)
 * which bypasses RLS. Falls back to the publishable/anon key, which works through
 * the narrow RLS policies and security-definer RPCs defined in
 * supabase/migrations. If no Supabase env vars are set, returns null and the
 * app uses the local file store.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

function serverKey(): string | undefined {
  return (
    process.env.SUPABASE_SECRET_KEY ??
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function isSupabaseServerConfigured(): boolean {
  return Boolean(SUPABASE_URL && serverKey());
}

/** True when the server has elevated (RLS-bypassing) access. */
export function hasSupabaseAdminKey(): boolean {
  return Boolean(
    process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

let cached: SupabaseClient | null = null;

export function getSupabaseServer(): SupabaseClient | null {
  if (!isSupabaseServerConfigured()) return null;
  if (!cached) {
    cached = createClient(SUPABASE_URL!, serverKey()!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}
