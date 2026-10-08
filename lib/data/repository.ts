import type { RowDataPacket } from "mysql2/promise";
import { dbConfigurado, getPool } from "@/lib/db/client";
import {
  DEMO_CATEGORIAS,
  DEMO_CLIENTES,
  DEMO_CUENTAS,
  DEMO_FOTOS,
  DEMO_MOVIMIENTOS,
  DEMO_OPERACIONES,
  DEMO_PUBLICACIONES,
  DEMO_VEHICULOS,
} from "@/lib/data/mock";
import type {
  Categoria,
  Cliente,
  Cuenta,
  Movimiento,
  Operacion,
  Publicacion,
  Vehiculo,
  VehiculoFoto,
} from "@/lib/types/database";

/**
 * Capa de acceso a datos unificada:
 * - MySQL real cuando está configurado (env vars).
 * - Clon de los datos demo en memoria si no (modo demo).
 * Todas las funciones son async.
 */

export class DemoReadOnlyError extends Error {
  constructor() {
    super(
      "Modo demo (sin base de datos configurada): la app es de solo lectura. " +
        "Configurá DATABASE_URL (o MYSQL_HOST/PORT/USER/PASSWORD/DATABASE) para operar datos reales.",
    );
  }
}

type DemoState = {
  vehiculos: Vehiculo[];
  clientes: Cliente[];
  categorias: Categoria[];
  cuentas: Cuenta[];
  operaciones: Operacion[];
  movimientos: Movimiento[];
  publicaciones: Publicacion[];
  fotos: VehiculoFoto[];
};

function cloneDemo(): DemoState {
  return {
    vehiculos: [...DEMO_VEHICULOS],
    clientes: [...DEMO_CLIENTES],
    categorias: [...DEMO_CATEGORIAS],
    cuentas: [...DEMO_CUENTAS],
    operaciones: [...DEMO_OPERACIONES],
    movimientos: [...DEMO_MOVIMIENTOS],
    publicaciones: [...DEMO_PUBLICACIONES],
    fotos: [...DEMO_FOTOS],
  };
}

// ── Estado en memoria (modo demo), reseteado por `resetDemo` ──
let state = cloneDemo();

export function resetDemo(): void {
  state = cloneDemo();
}

async function rows<T>(sql: string, params: unknown[] = []): Promise<T[]> {
  const pool = getPool();
  const [result] = await pool!.query<(T & RowDataPacket)[]>(sql, params);
  return result;
}

export const repo = {
  getVehiculos: async (): Promise<Vehiculo[]> => {
    if (dbConfigurado()) return rows<Vehiculo>("SELECT * FROM vehiculos ORDER BY marca");
    return [...state.vehiculos];
  },

  getClientes: async (): Promise<Cliente[]> => {
    if (dbConfigurado()) return rows<Cliente>("SELECT * FROM clientes ORDER BY name");
    return [...state.clientes];
  },

  getCategorias: async (): Promise<Categoria[]> => {
    if (dbConfigurado()) return rows<Categoria>("SELECT * FROM categorias ORDER BY name");
    return [...state.categorias];
  },

  getCuentas: async (): Promise<Cuenta[]> => {
    if (dbConfigurado()) return rows<Cuenta>("SELECT * FROM cuentas ORDER BY name");
    return [...state.cuentas];
  },

  getOperaciones: async (): Promise<Operacion[]> => {
    if (dbConfigurado()) return rows<Operacion>("SELECT * FROM operaciones ORDER BY fecha DESC");
    return [...state.operaciones].sort((a, b) => b.fecha.localeCompare(a.fecha));
  },

  getMovimientos: async (): Promise<Movimiento[]> => {
    if (dbConfigurado()) return rows<Movimiento>("SELECT * FROM movimientos ORDER BY fecha DESC");
    return [...state.movimientos].sort((a, b) => b.fecha.localeCompare(a.fecha));
  },

  getMovimientosByVehiculo: async (vehiculoId: number): Promise<Movimiento[]> => {
    if (dbConfigurado()) {
      return rows<Movimiento>("SELECT * FROM movimientos WHERE vehiculo_id = ? ORDER BY fecha DESC", [vehiculoId]);
    }
    return state.movimientos.filter((m) => m.vehiculo_id === vehiculoId);
  },

  getPublicaciones: async (): Promise<Publicacion[]> => {
    if (dbConfigurado()) return rows<Publicacion>("SELECT * FROM publicaciones ORDER BY actualizado_at DESC");
    return [...state.publicaciones];
  },

  getPublicacionesByVehiculo: async (vehiculoId: number): Promise<Publicacion[]> => {
    if (dbConfigurado()) return rows<Publicacion>("SELECT * FROM publicaciones WHERE vehiculo_id = ?", [vehiculoId]);
    return state.publicaciones.filter((p) => p.vehiculo_id === vehiculoId);
  },

  getFotos: async (): Promise<VehiculoFoto[]> => {
    if (dbConfigurado()) return rows<VehiculoFoto>("SELECT * FROM vehiculo_fotos ORDER BY orden");
    return [...state.fotos];
  },

  getFotosByVehiculo: async (vehiculoId: number): Promise<VehiculoFoto[]> => {
    if (dbConfigurado()) {
      return rows<VehiculoFoto>("SELECT * FROM vehiculo_fotos WHERE vehiculo_id = ? ORDER BY orden", [vehiculoId]);
    }
    return state.fotos.filter((f) => f.vehiculo_id === vehiculoId).sort((a, b) => a.orden - b.orden);
  },
};
