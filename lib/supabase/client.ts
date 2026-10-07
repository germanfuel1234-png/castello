import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase.
 * - Sin credenciales la app corre en MODO DEMO con datos ficticios
 *   (`lib/data/mock.ts`).
 * - Al definir NEXT_PUBLIC_SUPABASE_URL/ANON_KEY se usa Supabase real.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";

export function supabaseConfigurado(): boolean {
  return url.length > 0 && anonKey.length > 0;
}

let _client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!supabaseConfigurado()) return null;
  if (!_client) {
    _client = createClient(url, anonKey);
  }
  return _client;
}

export function modoDemo(): boolean {
  return !supabaseConfigurado();
}
