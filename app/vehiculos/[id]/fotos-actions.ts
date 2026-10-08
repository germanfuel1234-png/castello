"use server";

import type { RowDataPacket } from "mysql2/promise";
import { getPool } from "@/lib/db/client";
import { DemoReadOnlyError } from "@/lib/data/repository";
import { eliminarFotoArchivo, extensionValida, guardarFoto } from "@/lib/storage/fotos";

export interface FotosResult {
  ok: boolean;
  error: string | null;
}

export async function subirFotosAction(_prev: FotosResult, formData: FormData): Promise<FotosResult> {
  const vehiculoId = Number(formData.get("vehiculo_id"));
  const archivos = formData.getAll("fotos").filter((f): f is File => f instanceof File && f.size > 0);

  if (archivos.length === 0) {
    return { ok: false, error: "Elegí al menos una foto." };
  }
  for (const archivo of archivos) {
    if (!extensionValida(archivo.type)) {
      return { ok: false, error: `${archivo.name}: formato no soportado (usar JPG, PNG o WEBP).` };
    }
  }

  const pool = getPool();
  if (!pool) {
    return { ok: false, error: new DemoReadOnlyError().message };
  }

  try {
    const [[{ siguiente }]] = await pool.query<({ siguiente: number } & RowDataPacket)[]>(
      "SELECT COALESCE(MAX(orden), -1) + 1 AS siguiente FROM vehiculo_fotos WHERE vehiculo_id = ?",
      [vehiculoId],
    );
    let orden = siguiente;
    for (const archivo of archivos) {
      const nombre = await guardarFoto(vehiculoId, archivo);
      await pool.execute("INSERT INTO vehiculo_fotos (vehiculo_id, archivo, orden) VALUES (?, ?, ?)", [
        vehiculoId,
        nombre,
        orden,
      ]);
      orden += 1;
    }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }

  return { ok: true, error: null };
}

export async function eliminarFotoAction(_prev: FotosResult, formData: FormData): Promise<FotosResult> {
  const vehiculoId = Number(formData.get("vehiculo_id"));
  const fotoId = Number(formData.get("foto_id"));
  const archivo = String(formData.get("archivo") ?? "");

  const pool = getPool();
  if (!pool) {
    return { ok: false, error: new DemoReadOnlyError().message };
  }

  try {
    await pool.execute("DELETE FROM vehiculo_fotos WHERE id = ?", [fotoId]);
    await eliminarFotoArchivo(vehiculoId, archivo);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }

  return { ok: true, error: null };
}
