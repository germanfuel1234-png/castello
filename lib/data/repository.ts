import { getSupabaseClient, modoDemo } from "@/lib/supabase/client";
import {
  DEMO_CATEGORIAS,
  DEMO_CLIENTES,
  DEMO_CUENTAS,
  DEMO_MOVIMIENTOS,
  DEMO_OPERACIONES,
  DEMO_VEHICULOS,
} from "@/lib/data/mock";
import type { Categoria, Cliente, Cuenta, Movimiento, Operacion, Vehiculo } from "@/lib/types/database";

/**
 * Capa de acceso a datos unificada:
 * - Supabase real cuando está configurado (env vars).
 * - Clon de los datos demo en memoria si no (modo demo).
 * Todas las funciones son async.
 */

export class DemoReadOnlyError extends Error {
  constructor() {
    super(
      "Modo demo (sin credenciales Supabase): la app es de solo lectura. " +
        "Configurá NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY para operar datos reales.",
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
};

function cloneDemo(): DemoState {
  return {
    vehiculos: [...DEMO_VEHICULOS],
    clientes: [...DEMO_CLIENTES],
    categorias: [...DEMO_CATEGORIAS],
    cuentas: [...DEMO_CUENTAS],
    operaciones: [...DEMO_OPERACIONES],
    movimientos: [...DEMO_MOVIMIENTOS],
  };
}

// ── Estado en memoria (modo demo), reseteado por `resetDemo` ──
let state = cloneDemo();

export function resetDemo(): void {
  state = cloneDemo();
}

export const repo = {
  getVehiculos: async (): Promise<Vehiculo[]> => {
    const sb = getSupabaseClient();
    if (sb) {
      const { data, error } = await sb.from("vehiculos").select("*").order("marca");
      if (error) throw error;
      return data ?? [];
    }
    return [...state.vehiculos];
  },

  getClientes: async (): Promise<Cliente[]> => {
    const sb = getSupabaseClient();
    if (sb) {
      const { data, error } = await sb.from("clientes").select("*").order("name");
      if (error) throw error;
      return data ?? [];
    }
    return [...state.clientes];
  },

  getCategorias: async (): Promise<Categoria[]> => {
    const sb = getSupabaseClient();
    if (sb) {
      const { data, error } = await sb.from("categorias").select("*").order("name");
      if (error) throw error;
      return data ?? [];
    }
    return [...state.categorias];
  },

  getCuentas: async (): Promise<Cuenta[]> => {
    const sb = getSupabaseClient();
    if (sb) {
      const { data, error } = await sb.from("cuentas").select("*").order("name");
      if (error) throw error;
      return data ?? [];
    }
    return [...state.cuentas];
  },

  getOperaciones: async (): Promise<Operacion[]> => {
    const sb = getSupabaseClient();
    if (sb) {
      const { data, error } = await sb.from("operaciones").select("*").order("fecha", { ascending: false });
      if (error) throw error;
      return data ?? [];
    }
    return [...state.operaciones].sort((a, b) => b.fecha.localeCompare(a.fecha));
  },

  getMovimientos: async (): Promise<Movimiento[]> => {
    const sb = getSupabaseClient();
    if (sb) {
      const { data, error } = await sb.from("movimientos").select("*").order("fecha", { ascending: false });
      if (error) throw error;
      return data ?? [];
    }
    return [...state.movimientos].sort((a, b) => b.fecha.localeCompare(a.fecha));
  },

  getMovimientosByVehiculo: async (vehiculoId: number): Promise<Movimiento[]> => {
    const sb = getSupabaseClient();
    if (sb) {
      const { data, error } = await sb
        .from("movimientos")
        .select("*")
        .eq("vehiculo_id", vehiculoId)
        .order("fecha", { ascending: false });
      if (error) throw error;
      return data ?? [];
    }
    return state.movimientos.filter((m) => m.vehiculo_id === vehiculoId);
  },
};

export function ensureWrite(): void {
  if (modoDemo()) throw new DemoReadOnlyError();
}
