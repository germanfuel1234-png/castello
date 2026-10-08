"use server";

import { getPool } from "@/lib/db/client";
import { parseAmount } from "@/lib/business/money";
import { DemoReadOnlyError } from "@/lib/data/repository";

export interface NuevaOperacionResult {
  ok: boolean;
  error: string | null;
}

function montoOpcional(formData: FormData, campo: string): number | null {
  const raw = String(formData.get(campo) ?? "").trim();
  if (!raw) return null;
  return parseAmount(raw);
}

export async function registrarOperacionAction(
  _prev: NuevaOperacionResult,
  formData: FormData,
): Promise<NuevaOperacionResult> {
  const pvNumero = String(formData.get("pv_numero") ?? "").trim();
  const vendedor = String(formData.get("vendedor") ?? "").trim();
  const fecha = String(formData.get("fecha") ?? "");
  const vehiculoId = formData.get("vehiculo_id") ? Number(formData.get("vehiculo_id")) : null;
  const clienteId = formData.get("cliente_id") ? Number(formData.get("cliente_id")) : null;
  const precioRaw = String(formData.get("precio_venta") ?? "");
  const moneda = String(formData.get("moneda") ?? "ars");
  const formaPago = String(formData.get("forma_pago") ?? "contado");
  const comentarios = String(formData.get("comentarios") ?? "").trim();

  const precio = parseAmount(precioRaw);
  if (precio === null || precio <= 0) {
    return { ok: false, error: "Precio inválido (usá formato 1.234.567,00)." };
  }
  if (!fecha || !vehiculoId || !clienteId) {
    return { ok: false, error: "Vehículo, cliente y fecha son obligatorios." };
  }
  if (formaPago !== "contado" && formaPago !== "financiado") {
    return { ok: false, error: "Forma de pago inválida." };
  }
  if (moneda !== "ars" && moneda !== "usd") {
    return { ok: false, error: "Moneda inválida." };
  }

  const permutaMarca = String(formData.get("permuta_marca") ?? "").trim();
  const permutaModelo = String(formData.get("permuta_modelo") ?? "").trim();
  const permutaDominio = String(formData.get("permuta_dominio") ?? "").trim();
  const permutaAnioRaw = String(formData.get("permuta_anio") ?? "").trim();
  const permutaKmRaw = String(formData.get("permuta_km") ?? "").trim();

  const pool = getPool();
  if (!pool) {
    return { ok: false, error: new DemoReadOnlyError().message };
  }

  try {
    await pool.execute(
      `INSERT INTO operaciones
        (pv_numero, vendedor, fecha, vehiculo_id, cliente_id, precio_venta, moneda,
         costo_transferencia, costo_formularios, costo_certificacion_firmas, costo_accesorios,
         permuta_marca, permuta_modelo, permuta_dominio, permuta_anio, permuta_km, permuta_precio,
         comentarios, forma_pago, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pendiente')`,
      [
        pvNumero || null,
        vendedor || null,
        fecha,
        vehiculoId,
        clienteId,
        precio,
        moneda,
        montoOpcional(formData, "costo_transferencia"),
        montoOpcional(formData, "costo_formularios"),
        montoOpcional(formData, "costo_certificacion_firmas"),
        montoOpcional(formData, "costo_accesorios"),
        permutaMarca || null,
        permutaModelo || null,
        permutaDominio || null,
        permutaAnioRaw ? Number(permutaAnioRaw) : null,
        permutaKmRaw ? Number(permutaKmRaw) : null,
        montoOpcional(formData, "permuta_precio"),
        comentarios || null,
        formaPago,
      ],
    );
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }

  return { ok: true, error: null };
}
