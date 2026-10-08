import { MetaCatalogoPublisher } from "@/lib/integrations/meta-catalogo";
import { MotordillPublisher } from "@/lib/integrations/motordill";
import type { ListingPublisher, VehiculoListingPayload } from "@/lib/integrations/types";
import { fotoUrl } from "@/lib/storage/fotos";
import type { CanalPublicacion, Publicacion, Vehiculo, VehiculoFoto } from "@/lib/types/database";

/**
 * Registro de conectores por canal. 2 canales cubren las 5 plataformas
 * pedidas: 'motordill' empuja también a ML, 'meta_catalogo' alimenta
 * WhatsApp Catalog + Instagram + Facebook.
 */
export const PUBLISHERS: Record<CanalPublicacion, ListingPublisher> = {
  motordill: new MotordillPublisher(),
  meta_catalogo: new MetaCatalogoPublisher(),
};

export const NOMBRE_CANAL: Record<CanalPublicacion, string> = {
  motordill: "Motordill / ML",
  meta_catalogo: "WhatsApp · Instagram · Facebook",
};

export function vehiculoToListingPayload(vehiculo: Vehiculo, fotos: VehiculoFoto[]): VehiculoListingPayload {
  return {
    vehiculoId: vehiculo.id,
    titulo: `${vehiculo.marca} ${vehiculo.modelo}${vehiculo.version ? ` ${vehiculo.version}` : ""}`,
    marca: vehiculo.marca,
    modelo: vehiculo.modelo,
    version: vehiculo.version,
    anio: vehiculo.anio,
    km: vehiculo.km,
    precio: vehiculo.precio,
    moneda: vehiculo.moneda,
    combustible: vehiculo.combustible,
    transmision: vehiculo.transmision,
    tipoCarroceria: vehiculo.tipo_carroceria,
    puertas: vehiculo.puertas,
    motor: vehiculo.motor,
    direccion: vehiculo.direccion,
    aceptaPermuta: vehiculo.acepta_permuta,
    precioNegociable: vehiculo.precio_negociable,
    descripcion: vehiculo.descripcion,
    fotos: fotos.map((f) => fotoUrl(vehiculo.id, f.archivo)),
  };
}

/** Valida que un vehículo tenga lo mínimo para publicarse en cualquier canal. */
export function validarVehiculoParaPublicar(vehiculo: Vehiculo, cantidadFotos: number): string[] {
  const errores: string[] = [];
  if (vehiculo.estado !== "disponible") {
    errores.push("Solo se publican vehículos en estado 'disponible'.");
  }
  if (vehiculo.precio === null) {
    errores.push("Falta cargar el precio.");
  }
  if (cantidadFotos === 0) {
    errores.push("Falta cargar al menos una foto.");
  }
  return errores;
}

export function publicacionesPendientes<T extends Pick<Publicacion, "estado">>(pubs: T[]): T[] {
  return pubs.filter((p) => p.estado === "pendiente");
}

/** Estado de un vehículo en un canal dado, o null si todavía no se intentó publicar. */
export function estadoEnCanal(
  publicaciones: Publicacion[],
  vehiculoId: number,
  canal: CanalPublicacion,
): Publicacion | null {
  return publicaciones.find((p) => p.vehiculo_id === vehiculoId && p.canal === canal) ?? null;
}

export function fotosDeVehiculo(fotos: VehiculoFoto[], vehiculoId: number): VehiculoFoto[] {
  return fotos.filter((f) => f.vehiculo_id === vehiculoId);
}
