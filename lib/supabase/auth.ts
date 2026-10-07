import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseConfigurado } from "@/lib/supabase/client";

/**
 * Helpers de Supabase Auth para Server Components / Server Actions.
 * Únicamente activos cuando hay credenciales (NEXT_PUBLIC_SUPABASE_URL/ANON_KEY);
 * en modo demo no hay sesión ni login (banner lo aclara).
 */

/** Cliente con cookies del scope de request (`cookies()` es async en Next 16). */
async function serverClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const cookieStore = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(sets) {
        try {
          sets.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Llamado desde Server Component: el set de cookies se omite.
        }
      },
    },
  });
}

/** Cliente para el proxy (cookies desde request/response). */
export function proxyClient(request: NextRequest, response: NextResponse) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(sets) {
        sets.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });
}

/** Usuario autenticado actual (null si no hay sesión o estamos en demo). */
export async function getCurrentUser() {
  if (!supabaseConfigurado()) return null;
  const { data } = await (await serverClient()).auth.getUser();
  return data.user ?? null;
}

export async function signInWithPassword(email: string, password: string) {
  const { data, error } = await (await serverClient()).auth.signInWithPassword({ email, password });
  return { user: data.user ?? null, error: error?.message };
}

export async function signOut() {
  if (!supabaseConfigurado()) return;
  const { error } = await (await serverClient()).auth.signOut();
  if (error) throw error;
}
