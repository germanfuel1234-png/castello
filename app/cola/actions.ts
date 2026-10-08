"use server";

import { getPool } from "@/lib/db/client";
import { validarCategorizacion } from "@/lib/business/cola-pendientes";
import { DemoReadOnlyError } from "@/lib/data/repository";

export interface CategorizarResult {
  ok: boolean;
  error: string | null;
}

/**
 * Cola de pendientes: asigna vehículo/categoría a un movimiento
 * automatizado y lo marca como categorizado.
 * - Demo (sin base de datos): rechazado con mensaje claro (solo lectura).
 * - MySQL: UPDATE sobre `movimientos`.
 */
export async function categorizarMovimientoAction(_prev: CategorizarResult, formData: FormData): Promise<CategorizarResult> {
  const id = Number(formData.get("movement_id"));
  const vehiculoId = formData.get("vehiculo_id") ? Number(formData.get("vehiculo_id")) : null;
  const categoryId = formData.get("category_id") ? Number(formData.get("category_id")) : null;

  const errores = validarCategorizacion({ vehiculo_id: vehiculoId, category_id: categoryId });
  if (errores.length > 0) {
    return { ok: false, error: errores.join(" · ") };
  }

  const pool = getPool();
  if (!pool) {
    return { ok: false, error: new DemoReadOnlyError().message };
  }

  try {
    await pool.execute(
      "UPDATE movimientos SET vehiculo_id = ?, category_id = ?, estado_categorizacion = 'categorizado' WHERE id = ?",
      [vehiculoId, categoryId, id],
    );
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }

  return { ok: true, error: null };
}
