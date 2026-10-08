"use server";

import { getPool } from "@/lib/db/client";
import { PUBLISHERS, validarVehiculoParaPublicar, vehiculoToListingPayload } from "@/lib/business/publicaciones";
import { repo } from "@/lib/data/repository";
import { IntegrationNotConfiguredError } from "@/lib/integrations/types";
import type { CanalPublicacion } from "@/lib/types/database";

export interface PublicarResult {
  ok: boolean;
  error: string | null;
}

const UPSERT_PUBLICACION = `
  INSERT INTO publicaciones (vehiculo_id, canal, estado, external_id, mensaje_error, actualizado_at)
  VALUES (?, ?, ?, ?, ?, ?)
  ON DUPLICATE KEY UPDATE estado = VALUES(estado), external_id = VALUES(external_id),
    mensaje_error = VALUES(mensaje_error), actualizado_at = VALUES(actualizado_at)
`;

/**
 * A diferencia de las demás acciones del repo, el efecto principal de
 * publicar es externo (la llamada al canal), no la escritura en la base.
 * Por eso se intenta la llamada primero —y falla con el mensaje de
 * "faltan credenciales" del conector— incluso en modo demo; recién al
 * tener un resultado exitoso se intenta persistir el estado en MySQL.
 */
export async function publicarVehiculoAction(_prev: PublicarResult, formData: FormData): Promise<PublicarResult> {
  const vehiculoId = Number(formData.get("vehiculo_id"));
  const canal = String(formData.get("canal") ?? "") as CanalPublicacion;

  const publisher = PUBLISHERS[canal];
  if (!publisher) {
    return { ok: false, error: `Canal desconocido: ${canal}` };
  }

  const [vehiculos, fotos] = await Promise.all([repo.getVehiculos(), repo.getFotosByVehiculo(vehiculoId)]);
  const vehiculo = vehiculos.find((v) => v.id === vehiculoId);
  if (!vehiculo) {
    return { ok: false, error: "Vehículo no encontrado." };
  }

  const errores = validarVehiculoParaPublicar(vehiculo, fotos.length);
  if (errores.length > 0) {
    return { ok: false, error: errores.join(" · ") };
  }

  try {
    const { externalId } = await publisher.publish(vehiculoToListingPayload(vehiculo, fotos));

    const pool = getPool();
    if (!pool) {
      return { ok: false, error: "Se publicó, pero no se guardó el estado (falta configurar la base de datos)." };
    }
    await pool.execute(UPSERT_PUBLICACION, [vehiculoId, canal, "publicado", externalId, null, new Date()]);
    return { ok: true, error: null };
  } catch (e) {
    const mensaje = e instanceof IntegrationNotConfiguredError ? e.message : e instanceof Error ? e.message : String(e);

    const pool = getPool();
    if (pool) {
      await pool.execute(UPSERT_PUBLICACION, [vehiculoId, canal, "error", null, mensaje, new Date()]);
    }
    return { ok: false, error: mensaje };
  }
}
