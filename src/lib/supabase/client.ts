/**
 * Browser Supabase client stub.
 *
 * When ready to connect:
 *   npm install @supabase/supabase-js
 *   Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
 *
 * import { createBrowserClient } from '@supabase/ssr'
 * export const supabase = createBrowserClient(url, anonKey)
 */

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export const supabase = null as unknown as null;
