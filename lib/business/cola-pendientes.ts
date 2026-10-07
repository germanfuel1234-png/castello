import { type Movimiento } from "@/lib/types/database";

/**
 * Cola única de movimientos pendientes de categorizar.
 * Todo dato automatizado (cuando haya integraciones) entra primero con
 * `estado_categorizacion = 'pendiente'`; un humano lo asigna a
 * vehículo/categoría antes de que impacte los reportes. Se modela como
 * filtro sobre `movimientos` (no una tabla duplicada).
 */

export function movimientosPendientes<T extends Pick<Movimiento, "estado_categorizacion">>(
  movs: T[],
): T[] {
  return movs.filter((m) => m.estado_categorizacion === "pendiente");
}

export function movimientosCategorizados<T extends Pick<Movimiento, "estado_categorizacion">>(
  movs: T[],
): T[] {
  return movs.filter((m) => m.estado_categorizacion === "categorizado");
}

export interface CategorizacionInput {
  vehiculo_id: number | null;
  category_id: number | null;
}

/** Valida que un movimiento pendiente se pueda categorizar con datos coherentes. */
export function validarCategorizacion(input: CategorizacionInput): string[] {
  const errores: string[] = [];
  if (input.category_id === null) errores.push("Falta asignar categoría");
  return errores;
}

/**
 * Categoriza un movimiento pendiente (sin efectos laterales; el caller persiste).
 */
export function categorizarMovimiento<T extends Movimiento>(
  mov: T,
  input: CategorizacionInput,
): { mov: T; errores: string[] } {
  const errores = validarCategorizacion(input);
  if (errores.length > 0) {
    return { mov, errores };
  }
  const actualizado: Movimiento = {
    ...mov,
    vehiculo_id: input.vehiculo_id,
    category_id: input.category_id,
    estado_categorizacion: "categorizado",
  };
  return { mov: actualizado as T, errores: [] };
}

/** Contador para badges: cuántos movimientos esperan categorización. */
export function contarPendientes<T extends Pick<Movimiento, "estado_categorizacion">>(movs: T[]): number {
  return movimientosPendientes(movs).length;
}
