"use server";

import { getSupabaseClient } from "@/lib/supabase/client";
import { validarCategorizacion } from "@/lib/business/cola-pendientes";
import { DemoReadOnlyError } from "@/lib/data/repository";

export interface CategorizarResult {
  ok: boolean;
  error: string | null;
}

/**
 * Cola de pendientes: asigna vehículo/categoría a un movimiento
 * automatizado y lo marca como categorizado.
 * - Demo (sin credenciales): rechazado con mensaje claro (solo lectura).
 * - Supabase: UPDATE sobre `movimientos`.
 */
export async function categorizarMovimientoAction(_prev: CategorizarResult, formData: FormData): Promise<CategorizarResult> {
  const id = Number(formData.get("movement_id"));
  const vehiculoId = formData.get("vehiculo_id") ? Number(formData.get("vehiculo_id")) : null;
  const categoryId = formData.get("category_id") ? Number(formData.get("category_id")) : null;

  const errores = validarCategorizacion({ vehiculo_id: vehiculoId, category_id: categoryId });
  if (errores.length > 0) {
    return { ok: false, error: errores.join(" · ") };
  }

  const sb = getSupabaseClient();
  if (!sb) {
    return { ok: false, error: new DemoReadOnlyError().message };
  }

  const { error } = await sb
    .from("movimientos")
    .update({
      vehiculo_id: vehiculoId,
      category_id: categoryId,
      estado_categorizacion: "categorizado",
    })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };
  return { ok: true, error: null };
}
