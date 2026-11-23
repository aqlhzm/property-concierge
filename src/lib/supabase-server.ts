import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/**
 * Server-only Supabase client.
 *
 * Uses the publishable key, kept on the server (no NEXT_PUBLIC_ prefix, so it never reaches the browser).
 * The `leads` table has RLS with no policies, so this key cannot read or write it directly —
 * it can only call the insert-only `submit_lead()` function. See supabase/migrations/0001_leads.sql.
 *
 * Returns null when env vars are missing so the UI can fall back to WhatsApp.
 */
export function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  client ??= createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return client;
}
