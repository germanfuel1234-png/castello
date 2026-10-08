import type { CanalPublicacion, Combustible, Moneda, TipoCarroceria, TipoDireccion, Transmision } from "@/lib/types/database";

/**
 * Contrato mínimo para publicar un vehículo en un canal externo.
 * Cada campo es lo que un portal de autos necesita para armar un aviso.
 */
export interface VehiculoListingPayload {
  vehiculoId: number;
  titulo: string;
  marca: string;
  modelo: string;
  version: string | null;
  anio: number | null;
  km: number | null;
  precio: number | null;
  moneda: Moneda | null;
  combustible: Combustible | null;
  transmision: Transmision | null;
  tipoCarroceria: TipoCarroceria | null;
  puertas: number | null;
  motor: string | null;
  direccion: TipoDireccion | null;
  aceptaPermuta: boolean;
  precioNegociable: boolean;
  descripcion: string | null;
  /** URLs absolutas de las fotos, en el orden en que deben publicarse. */
  fotos: string[];
}

export interface PublishResult {
  externalId: string;
}

export interface ListingPublisher {
  readonly canal: CanalPublicacion;
  publish(listing: VehiculoListingPayload): Promise<PublishResult>;
  unpublish(externalId: string): Promise<void>;
}

/** Faltan credenciales/config para operar el canal — no se intentó ninguna llamada real. */
export class IntegrationNotConfiguredError extends Error {
  constructor(
    public readonly canal: string,
    public readonly faltantes: string[],
  ) {
    super(`${canal}: faltan variables de entorno: ${faltantes.join(", ")}`);
  }
}
