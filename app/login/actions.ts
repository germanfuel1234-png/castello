"use server";

import { redirect } from "next/navigation";
import { signInWithPassword } from "@/lib/supabase/auth";
import { supabaseConfigurado } from "@/lib/supabase/client";

export interface LoginResult {
  error: string | null;
}

/**
 * Inicio de sesión. En modo demo no hay credenciales → no hay login
 * real; la app se usa igual (banner lo indica). Con Supabase configurado
 * autentica contra `auth.users`.
 */
export async function loginAction(_prev: LoginResult, formData: FormData): Promise<LoginResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/");

  if (!supabaseConfigurado()) {
    return {
      error: "Modo demo: sin credenciales Supabase. No hace falta iniciar sesión — ingresá directo a la app.",
    };
  }

  if (!email || !password) {
    return { error: "Completá email y contraseña." };
  }

  const { error } = await signInWithPassword(email, password);
  if (error) {
    return { error };
  }

  redirect(next.startsWith("/") ? next : "/");
}
