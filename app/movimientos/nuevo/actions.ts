"use server";

import { getPool } from "@/lib/db/client";
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
  const moneda = String(formData.get("moneda") ?? "ars");
  const modalidad = String(formData.get("modalidad") ?? "").trim();
  const tipoCambioRaw = String(formData.get("tipo_cambio") ?? "").trim();

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
  if (moneda !== "ars" && moneda !== "usd") {
    return { ok: false, error: "Moneda inválida." };
  }
  if (!categoryId) {
    return { ok: false, error: "La categoría es obligatoria." };
  }
  const tipoCambio = tipoCambioRaw ? parseAmount(tipoCambioRaw) : null;

  const pool = getPool();
  if (!pool) {
    return { ok: false, error: new DemoReadOnlyError().message };
  }

  try {
    await pool.execute(
      `INSERT INTO movimientos
        (fecha, amount, moneda, tipo_cambio, modalidad, type, source, description,
         estado_categorizacion, vehiculo_id, category_id, cuenta_id)
       VALUES (?, ?, ?, ?, ?, ?, 'manual', ?, 'categorizado', ?, ?, ?)`,
      [
        fecha,
        amount,
        moneda,
        tipoCambio,
        modalidad || null,
        tipo,
        description || "Carga manual",
        vehiculoId,
        categoryId,
        cuentaId,
      ],
    );
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }

  return { ok: true, error: null };
}
