import type { Categoria, Cliente, Cuenta, Movimiento, Operacion, Vehiculo } from "@/lib/types/database";

/**
 * ⚠️ DATOS FICTICIOS DE DEMOSTRACIÓN.
 * NO son datos reales del negocio: la app corre en "modo demo" hasta que se
 * configuren NEXT_PUBLIC_SUPABASE_URL/NEXT_PUBLIC_SUPABASE_ANON_KEY y se
 * carguen los datos reales de Castello (pendiente: Excel/planilla de Mariano).
 * Nombres y cifras inventados a propósito.
 */

export const DEMO_VEHICULOS: Vehiculo[] = [
  { id: 1, marca: "Demo — Chevrolet", modelo: "Onix", anio: 2021, patente: "AA000AA", km: 42000, estado: "disponible", precio: 12000000, created_at: "2026-08-01T00:00:00Z" },
  { id: 2, marca: "Demo — Volkswagen", modelo: "Gol Trend", anio: 2019, patente: "AB111BB", km: 68000, estado: "reservado", precio: 9500000, created_at: "2026-08-10T00:00:00Z" },
  { id: 3, marca: "Demo — Toyota", modelo: "Corolla", anio: 2022, patente: "AC222CC", km: 21000, estado: "vendido", precio: 21000000, created_at: "2026-07-20T00:00:00Z" },
];

export const DEMO_CLIENTES: Cliente[] = [
  { id: 1, name: "Cliente Demostrativo N°1", email: "cliente1@demo.invalid", phone: "+54 9 11 0000 0000", created_at: "2026-07-20T00:00:00Z" },
  { id: 2, name: "Cliente Demostrativo N°2", email: null, phone: "+54 9 11 1111 1111", created_at: "2026-09-01T00:00:00Z" },
];

export const DEMO_CATEGORIAS: Categoria[] = [
  { id: 1, name: "Venta de unidad", tipo: "ingreso", description: "Cobro por venta de vehículo" },
  { id: 2, name: "Señas / anticipos", tipo: "ingreso", description: "Anticipo a cuenta de una operación" },
  { id: 3, name: "Comisión vendedor", tipo: "egreso", description: "Comisión pagada por una venta" },
  { id: 4, name: "Preparación / service", tipo: "egreso", description: "Gastos de puesta a punto de la unidad" },
  { id: 5, name: "Marketing", tipo: "egreso", description: "Publicidad y promoción" },
  { id: 6, name: "Gastos generales", tipo: "egreso", description: "Gastos operativos varios" },
];

export const DEMO_CUENTAS: Cuenta[] = [
  { id: 1, name: "Efectivo", tipo: "efectivo", created_at: "2026-07-01T00:00:00Z" },
  { id: 2, name: "Cuenta bancaria principal", tipo: "banco", created_at: "2026-07-01T00:00:00Z" },
];

export const DEMO_OPERACIONES: Operacion[] = [
  { id: 1, vehiculo_id: 3, cliente_id: 1, fecha: "2026-09-15", precio_venta: 21000000, forma_pago: "contado", estado: "entregada", created_at: "2026-09-15T00:00:00Z" },
  { id: 2, vehiculo_id: 2, cliente_id: 2, fecha: "2026-10-01", precio_venta: 9500000, forma_pago: "financiado", estado: "confirmada", created_at: "2026-10-01T00:00:00Z" },
];

export const DEMO_MOVIMIENTOS: Movimiento[] = [
  { id: 1, vehiculo_id: 3, operacion_id: 1, cuenta_id: 2, category_id: 1, amount: 21000000, type: "ingreso", source: "manual", description: "Cobro venta Corolla", estado_categorizacion: "categorizado", fecha: "2026-09-15T00:00:00Z", created_at: "2026-09-15T00:00:00Z" },
  { id: 2, vehiculo_id: 2, operacion_id: 2, cuenta_id: 2, category_id: 2, amount: 2000000, type: "ingreso", source: "manual", description: "Seña Gol Trend", estado_categorizacion: "categorizado", fecha: "2026-10-01T00:00:00Z", created_at: "2026-10-01T00:00:00Z" },
  { id: 3, vehiculo_id: 3, operacion_id: 1, cuenta_id: 1, category_id: 3, amount: 400000, type: "egreso", source: "manual", description: "Comisión venta Corolla", estado_categorizacion: "categorizado", fecha: "2026-09-16T00:00:00Z", created_at: "2026-09-16T00:00:00Z" },
  { id: 4, vehiculo_id: null, operacion_id: null, cuenta_id: null, category_id: null, amount: 150000, type: "egreso", source: "manual", description: "Transferencia sin clasificar", estado_categorizacion: "pendiente", fecha: "2026-10-05T00:00:00Z", created_at: "2026-10-05T00:00:00Z" },
];
