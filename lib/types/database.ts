/**
 * Tipos de dominio alineados 1:1 con `db/schema.sql`.
 * Ampliado a partir de un boleto de preventa real (LEMA SRL, PV 125):
 * ficha de cliente completa, costos adicionales de la operación,
 * vehículo usado como parte de pago (permuta) y pagos multi-moneda
 * con tipo de cambio. Sigue siendo un punto de partida — se termina
 * de ajustar cuando Mariano confirme el resto de sus casos de uso.
 */

export type EstadoVehiculo = "disponible" | "reservado" | "vendido" | "a_ingresar";
export type Combustible = "nafta" | "diesel" | "gnc" | "electrico" | "hibrido";
export type Transmision = "manual" | "automatica";
export type TipoCarroceria = "sedan" | "hatchback" | "suv" | "pickup" | "furgon" | "coupe" | "rural" | "otro";
export type FormaPago = "contado" | "financiado";
export type EstadoOperacion = "pendiente" | "confirmada" | "entregada";
export type TipoMovimiento = "ingreso" | "egreso";
export type EstadoCategorizacion = "pendiente" | "categorizado";
export type TipoCuenta = "banco" | "efectivo" | "billetera_virtual";
export type OrigenMovimiento = "manual" | "manual_efectivo";
export type Moneda = "ars" | "usd";
export type ModalidadPago = "efectivo" | "transferencia" | "cheque" | "tarjeta" | "otro";
export type EstadoCivil = "soltero" | "casado" | "divorciado" | "viudo" | "union_convivencial";
export type CanalPublicacion = "motordill" | "meta_catalogo";
export type EstadoPublicacion = "pendiente" | "publicado" | "error" | "pausado";
export type TipoDireccion = "mecanica" | "hidraulica" | "electrica";
/** Quién cargó el vehículo — lista fija por ahora (solo Mariano y Leandro
 * usan el sistema); el día que haya más gente se reemplaza por una tabla
 * de usuarios real. */
export type CargadoPor = "mariano" | "leandro";

// ── Entidades (espejo del schema) ────────────────────────────────

export interface Vehiculo {
  id: number;
  marca: string;
  modelo: string;
  version: string | null;
  anio: number | null;
  patente: string | null;
  km: number | null;
  color: string | null;
  combustible: Combustible | null;
  transmision: Transmision | null;
  tipo_carroceria: TipoCarroceria | null;
  puertas: number | null;
  motor: string | null;
  direccion: TipoDireccion | null;
  cargado_por: CargadoPor | null;
  acepta_permuta: boolean;
  precio_negociable: boolean;
  descripcion: string | null;
  estado: EstadoVehiculo;
  precio: number | null;
  moneda: Moneda | null;
  created_at: string;
}

export interface Cliente {
  id: number;
  name: string;
  dni: string | null;
  email: string | null;
  phone: string | null;
  fecha_nacimiento: string | null;
  profesion: string | null;
  estado_civil: EstadoCivil | null;
  conyuge_nombre: string | null;
  conyuge_dni: string | null;
  calle: string | null;
  numero: string | null;
  localidad: string | null;
  cp: string | null;
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
  pv_numero: string | null;
  vendedor: string | null;
  vehiculo_id: number;
  cliente_id: number;
  fecha: string;
  moneda: Moneda;
  precio_venta: number;
  costo_transferencia: number | null;
  costo_formularios: number | null;
  costo_certificacion_firmas: number | null;
  costo_accesorios: number | null;
  // Vehículo del cliente usado como parte de pago (no es stock propio)
  permuta_dominio: string | null;
  permuta_marca: string | null;
  permuta_modelo: string | null;
  permuta_anio: number | null;
  permuta_km: number | null;
  permuta_precio: number | null;
  comentarios: string | null;
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
  moneda: Moneda;
  tipo_cambio: number | null;
  modalidad: ModalidadPago | null;
  type: TipoMovimiento;
  source?: OrigenMovimiento;
  description?: string;
  estado_categorizacion: EstadoCategorizacion;
  fecha: string;
  created_at: string;
}

export interface Publicacion {
  id: number;
  vehiculo_id: number;
  canal: CanalPublicacion;
  estado: EstadoPublicacion;
  external_id: string | null;
  mensaje_error: string | null;
  actualizado_at: string;
  created_at: string;
}

export interface VehiculoFoto {
  id: number;
  vehiculo_id: number;
  archivo: string;
  orden: number;
  created_at: string;
}

// ── Vistas útiles ────────────────────────────────────────────────

export interface MovimientoConDetalle extends Movimiento {
  vehiculo?: Vehiculo | null;
  operacion?: Operacion | null;
  categoria?: Categoria | null;
  cuenta?: Cuenta | null;
}
