"use server";

import { getSupabaseClient } from "@/lib/supabase/client";
import { parseAmount } from "@/lib/business/money";
import { DemoReadOnlyError } from "@/lib/data/repository";

export interface NuevoVehiculoResult {
  ok: boolean;
  error: string | null;
}

export async function registrarVehiculoAction(
  _prev: NuevoVehiculoResult,
  formData: FormData,
): Promise<NuevoVehiculoResult> {
  const marca = String(formData.get("marca") ?? "").trim();
  const modelo = String(formData.get("modelo") ?? "").trim();
  const anioRaw = String(formData.get("anio") ?? "").trim();
  const patente = String(formData.get("patente") ?? "").trim();
  const kmRaw = String(formData.get("km") ?? "").trim();
  const color = String(formData.get("color") ?? "").trim();
  const combustible = String(formData.get("combustible") ?? "").trim();
  const transmision = String(formData.get("transmision") ?? "").trim();
  const precioRaw = String(formData.get("precio") ?? "").trim();

  if (!marca || !modelo) {
    return { ok: false, error: "Marca y modelo son obligatorios." };
  }

  const anio = anioRaw ? Number(anioRaw) : null;
  if (anioRaw && (Number.isNaN(anio) || String(anio).length !== 4)) {
    return { ok: false, error: "Año inválido." };
  }
  const km = kmRaw ? Number(kmRaw) : null;
  if (kmRaw && Number.isNaN(km)) {
    return { ok: false, error: "Kilometraje inválido." };
  }
  const precio = precioRaw ? parseAmount(precioRaw) : null;
  if (precioRaw && precio === null) {
    return { ok: false, error: "Precio inválido (usá formato 1.234.567,00)." };
  }

  const sb = getSupabaseClient();
  if (!sb) {
    return { ok: false, error: new DemoReadOnlyError().message };
  }

  const { error } = await sb.from("vehiculos").insert({
    marca,
    modelo,
    anio,
    patente: patente || null,
    km,
    color: color || null,
    combustible: combustible || null,
    transmision: transmision || null,
    precio,
    estado: "disponible",
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true, error: null };
}
