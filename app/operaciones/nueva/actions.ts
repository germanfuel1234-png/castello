"use server";

import { getSupabaseClient } from "@/lib/supabase/client";
import { parseAmount } from "@/lib/business/money";
import { DemoReadOnlyError } from "@/lib/data/repository";

export interface NuevaOperacionResult {
  ok: boolean;
  error: string | null;
}

export async function registrarOperacionAction(
  _prev: NuevaOperacionResult,
  formData: FormData,
): Promise<NuevaOperacionResult> {
  const fecha = String(formData.get("fecha") ?? "");
  const vehiculoId = formData.get("vehiculo_id") ? Number(formData.get("vehiculo_id")) : null;
  const clienteId = formData.get("cliente_id") ? Number(formData.get("cliente_id")) : null;
  const precioRaw = String(formData.get("precio_venta") ?? "");
  const formaPago = String(formData.get("forma_pago") ?? "contado");

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

  const sb = getSupabaseClient();
  if (!sb) {
    return { ok: false, error: new DemoReadOnlyError().message };
  }

  const { error } = await sb.from("operaciones").insert({
    fecha,
    vehiculo_id: vehiculoId,
    cliente_id: clienteId,
    precio_venta: precio,
    forma_pago: formaPago,
    estado: "pendiente",
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true, error: null };
}
