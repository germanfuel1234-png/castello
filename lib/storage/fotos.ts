import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Fotos de vehículos guardadas como archivos bajo `public/uploads/`
 * (servido por Next en runtime, no solo en build) — necesita disco
 * persistente en el hosting final. Nada de servicios externos todavía.
 */

const EXTENSIONES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export function extensionValida(mimeType: string): boolean {
  return mimeType in EXTENSIONES;
}

function dirVehiculo(vehiculoId: number): string {
  return path.join(process.cwd(), "public", "uploads", "vehiculos", String(vehiculoId));
}

export function fotoUrl(vehiculoId: number, archivo: string): string {
  return `/uploads/vehiculos/${vehiculoId}/${archivo}`;
}

/** Guarda el archivo en disco y devuelve el nombre generado (no la ruta completa). */
export async function guardarFoto(vehiculoId: number, file: File): Promise<string> {
  const ext = EXTENSIONES[file.type];
  if (!ext) {
    throw new Error(`Tipo de archivo no soportado: ${file.type || "desconocido"} (usar JPG, PNG o WEBP).`);
  }
  const dir = dirVehiculo(vehiculoId);
  await mkdir(dir, { recursive: true });
  const archivo = `${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, archivo), buffer);
  return archivo;
}

export async function eliminarFotoArchivo(vehiculoId: number, archivo: string): Promise<void> {
  try {
    await unlink(path.join(dirVehiculo(vehiculoId), archivo));
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e;
  }
}
