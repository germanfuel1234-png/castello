"use server";

import { getSupabaseClient } from "@/lib/supabase/client";
import { parseAmount } from "@/lib/business/money";
import { DemoReadOnlyError } from "@/lib/data/repository";

export interface NuevoMovimientoResult {
  ok: boolean;
  error: string | null;
}

/**
 * Formulario simple de carga manual: el movimiento entra ya categorizado
 * (lo clasificó un humano) con `source = manual`.
 */
export async function registrarMovimientoManualAction(
  _prev: NuevoMovimientoResult,
  formData: FormData,
): Promise<NuevoMovimientoResult> {
  const fecha = String(formData.get("fecha") ?? "");
  const amountRaw = String(formData.get("amount") ?? "");
  const tipo = String(formData.get("type") ?? "ingreso");
  const description = String(formData.get("description") ?? "").trim();
  const categoryId = formData.get("category_id") ? Number(formData.get("category_id")) : null;
  const vehiculoId = formData.get("vehiculo_id") ? Number(formData.get("vehiculo_id")) : null;
  const cuentaId = formData.get("cuenta_id") ? Number(formData.get("cuenta_id")) : null;

  const amount = parseAmount(amountRaw);
  if (amount === null || amount <= 0) {
    return { ok: false, error: "Monto inválido (usá formato 1.234,56)." };
  }
  if (!fecha) {
    return { ok: false, error: "Faltó la fecha." };
  }
  if (tipo !== "ingreso" && tipo !== "egreso") {
    return { ok: false, error: "Tipo inválido." };
  }
  if (!categoryId) {
    return { ok: false, error: "La categoría es obligatoria." };
  }

  const sb = getSupabaseClient();
  if (!sb) {
    return { ok: false, error: new DemoReadOnlyError().message };
  }

  const { error } = await sb.from("movimientos").insert({
    fecha,
    amount,
    type: tipo,
    source: "manual",
    description: description || "Carga manual",
    estado_categorizacion: "categorizado",
    vehiculo_id: vehiculoId,
    category_id: categoryId,
    cuenta_id: cuentaId,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true, error: null };
}
