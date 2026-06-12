/**
 * Server Supabase client stub.
 *
 * When ready to connect:
 *   npm install @supabase/supabase-js @supabase/ssr
 *   Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
 *
 * import { createServerClient } from '@supabase/ssr'
 * import { cookies } from 'next/headers'
 */

export function isSupabaseServerConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function createSupabaseServerClient() {
  if (!isSupabaseServerConfigured()) {
    throw new Error("Supabase is not configured. See supabase/migrations/001_initial.sql");
  }
  // return createServerClient(...)
  return null;
}
