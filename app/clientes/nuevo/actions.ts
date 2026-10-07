"use server";

import { getSupabaseClient } from "@/lib/supabase/client";
import { DemoReadOnlyError } from "@/lib/data/repository";

export interface NuevoClienteResult {
  ok: boolean;
  error: string | null;
}

export async function registrarClienteAction(
  _prev: NuevoClienteResult,
  formData: FormData,
): Promise<NuevoClienteResult> {
  const name = String(formData.get("name") ?? "").trim();
  const dni = String(formData.get("dni") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();

  if (!name) {
    return { ok: false, error: "El nombre es obligatorio." };
  }

  const sb = getSupabaseClient();
  if (!sb) {
    return { ok: false, error: new DemoReadOnlyError().message };
  }

  const { error } = await sb.from("clientes").insert({
    name,
    dni: dni || null,
    phone: phone || null,
    email: email || null,
    address: address || null,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true, error: null };
}
