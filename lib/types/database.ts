/**
 * Tipos de dominio alineados 1:1 con `supabase/schema.sql`.
 * Esqueleto inicial: los campos específicos (financiación, comisiones,
 * etc.) se ajustan cuando Mariano confirme cómo trabaja realmente.
 */

export type EstadoVehiculo = "disponible" | "reservado" | "vendido";
export type Combustible = "nafta" | "diesel" | "gnc" | "electrico" | "hibrido";
export type Transmision = "manual" | "automatica";
export type FormaPago = "contado" | "financiado";
export type EstadoOperacion = "pendiente" | "confirmada" | "entregada";
export type TipoMovimiento = "ingreso" | "egreso";
export type EstadoCategorizacion = "pendiente" | "categorizado";
export type TipoCuenta = "banco" | "efectivo" | "billetera_virtual";
export type OrigenMovimiento = "manual" | "manual_efectivo";

// ── Entidades (espejo del schema) ────────────────────────────────

export interface Vehiculo {
  id: number;
  marca: string;
  modelo: string;
  anio: number | null;
  patente: string | null;
  km: number | null;
  color: string | null;
  combustible: Combustible | null;
  transmision: Transmision | null;
  estado: EstadoVehiculo;
  precio: number | null;
  created_at: string;
}

export interface Cliente {
  id: number;
  name: string;
  dni: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
}

export interface Categoria {
  id: number;
  name: string;
  tipo: "ingreso" | "egreso"; // ej: Venta de unidad, Comisión, Flete, Marketing…
  description: string | null;
}

export interface Cuenta {
  id: number;
  name: string;
  tipo: TipoCuenta;
  created_at: string;
}

export interface Operacion {
  id: number;
  vehiculo_id: number;
  cliente_id: number;
  fecha: string;
  precio_venta: number;
  forma_pago: FormaPago;
  estado: EstadoOperacion;
  created_at: string;
}

export interface Movimiento {
  id: number;
  vehiculo_id: number | null;
  operacion_id: number | null;
  cuenta_id: number | null;
  category_id: number | null;
  amount: number;
  type: TipoMovimiento;
  source?: OrigenMovimiento;
  description?: string;
  estado_categorizacion: EstadoCategorizacion;
  fecha: string;
  created_at: string;
}

// ── Vistas útiles ────────────────────────────────────────────────

export interface MovimientoConDetalle extends Movimiento {
  vehiculo?: Vehiculo | null;
  operacion?: Operacion | null;
  categoria?: Categoria | null;
  cuenta?: Cuenta | null;
}
