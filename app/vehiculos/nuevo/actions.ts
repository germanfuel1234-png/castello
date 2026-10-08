"use server";

import { getPool } from "@/lib/db/client";
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
  const version = String(formData.get("version") ?? "").trim();
  const anioRaw = String(formData.get("anio") ?? "").trim();
  const patente = String(formData.get("patente") ?? "").trim();
  const kmRaw = String(formData.get("km") ?? "").trim();
  const color = String(formData.get("color") ?? "").trim();
  const combustible = String(formData.get("combustible") ?? "").trim();
  const transmision = String(formData.get("transmision") ?? "").trim();
  const tipoCarroceria = String(formData.get("tipo_carroceria") ?? "").trim();
  const puertasRaw = String(formData.get("puertas") ?? "").trim();
  const motor = String(formData.get("motor") ?? "").trim();
  const direccion = String(formData.get("direccion") ?? "").trim();
  const cargadoPor = String(formData.get("cargado_por") ?? "").trim();
  const aceptaPermuta = formData.get("acepta_permuta") === "on";
  const precioNegociable = formData.get("precio_negociable") === "on";
  const descripcion = String(formData.get("descripcion") ?? "").trim();
  const precioRaw = String(formData.get("precio") ?? "").trim();
  const moneda = String(formData.get("moneda") ?? "ars").trim();

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
  const puertas = puertasRaw ? Number(puertasRaw) : null;
  if (puertasRaw && Number.isNaN(puertas)) {
    return { ok: false, error: "Cantidad de puertas inválida." };
  }
  const precio = precioRaw ? parseAmount(precioRaw) : null;
  if (precioRaw && precio === null) {
    return { ok: false, error: "Precio inválido (usá formato 1.234.567,00)." };
  }

  const pool = getPool();
  if (!pool) {
    return { ok: false, error: new DemoReadOnlyError().message };
  }

  try {
    await pool.execute(
      `INSERT INTO vehiculos
        (marca, modelo, version, anio, patente, km, color, combustible, transmision,
         tipo_carroceria, puertas, motor, direccion, cargado_por, acepta_permuta, precio_negociable,
         descripcion, precio, moneda, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'disponible')`,
      [
        marca,
        modelo,
        version || null,
        anio,
        patente || null,
        km,
        color || null,
        combustible || null,
        transmision || null,
        tipoCarroceria || null,
        puertas,
        motor || null,
        direccion || null,
        cargadoPor || null,
        aceptaPermuta,
        precioNegociable,
        descripcion || null,
        precio,
        precio !== null ? moneda : null,
      ],
    );
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }

  return { ok: true, error: null };
}
