import type { Categoria, Cliente, Cuenta, Movimiento, Operacion, Publicacion, Vehiculo, VehiculoFoto } from "@/lib/types/database";

/**
 * ⚠️ DATOS FICTICIOS DE DEMOSTRACIÓN.
 * NO son datos reales del negocio ni de ningún cliente/comprador real: la app
 * corre en "modo demo" hasta que se configuren NEXT_PUBLIC_SUPABASE_URL/
 * NEXT_PUBLIC_SUPABASE_ANON_KEY y se carguen los datos reales de Castello.
 * El vehículo #4 y la operación #3 reproducen la ESTRUCTURA de un boleto de
 * preventa real (PV, vendedor, permuta, pago multi-moneda con tipo de
 * cambio) pero con nombres, DNI y cifras inventados.
 */

export const DEMO_VEHICULOS: Vehiculo[] = [
  { id: 1, marca: "Demo — Chevrolet", modelo: "Onix", version: "Joy 1.2", anio: 2021, patente: "AA000AA", km: 42000, color: "Blanco", combustible: "nafta", transmision: "manual", tipo_carroceria: "hatchback", puertas: 5, motor: "1.2", direccion: "electrica", cargado_por: "mariano", acepta_permuta: true, precio_negociable: true, descripcion: "Único dueño, service oficial al día.", estado: "disponible", precio: 12000000, moneda: "ars", created_at: "2026-08-01T00:00:00Z" },
  { id: 2, marca: "Demo — Volkswagen", modelo: "Gol Trend", version: "Trendline 1.6", anio: 2019, patente: "AB111BB", km: 68000, color: "Gris", combustible: "nafta", transmision: "manual", tipo_carroceria: "hatchback", puertas: 5, motor: "1.6", direccion: "mecanica", cargado_por: "leandro", acepta_permuta: false, precio_negociable: true, descripcion: null, estado: "reservado", precio: 9500000, moneda: "ars", created_at: "2026-08-10T00:00:00Z" },
  { id: 3, marca: "Demo — Toyota", modelo: "Corolla", version: "XLI 2.0 CVT", anio: 2022, patente: "AC222CC", km: 21000, color: "Negro", combustible: "nafta", transmision: "automatica", tipo_carroceria: "sedan", puertas: 4, motor: "2.0", direccion: "electrica", cargado_por: "mariano", acepta_permuta: true, precio_negociable: false, descripcion: "Excelente estado general. Documentación al día, lista para transferir.", estado: "vendido", precio: 21000000, moneda: "ars", created_at: "2026-07-20T00:00:00Z" },
  { id: 4, marca: "Demo — Peugeot", modelo: "3008 HDI", version: "GT Line", anio: 2017, patente: "AD444DD", km: 85000, color: "Gris oscuro", combustible: "diesel", transmision: "automatica", tipo_carroceria: "suv", puertas: 5, motor: "1.6 HDI", direccion: "hidraulica", cargado_por: "leandro", acepta_permuta: true, precio_negociable: true, descripcion: null, estado: "reservado", precio: 19000, moneda: "usd", created_at: "2026-09-20T00:00:00Z" },
  { id: 5, marca: "Demo — Fiat", modelo: "Cronos", version: "Drive 1.3", anio: 2026, patente: null, km: 0, color: null, combustible: "nafta", transmision: "manual", tipo_carroceria: "sedan", puertas: 4, motor: "1.3", direccion: "electrica", cargado_por: "mariano", acepta_permuta: false, precio_negociable: false, descripcion: "0km, todavía no ingresó al stock.", estado: "a_ingresar", precio: 14000000, moneda: "ars", created_at: "2026-10-05T00:00:00Z" },
];

/** Sin fotos de ejemplo: en modo demo no hay archivos reales que mostrar. */
export const DEMO_FOTOS: VehiculoFoto[] = [];

export const DEMO_CLIENTES: Cliente[] = [
  { id: 1, name: "Cliente Demostrativo N°1", dni: "30111222", email: "cliente1@demo.invalid", phone: "+54 9 11 0000 0000", fecha_nacimiento: null, profesion: null, estado_civil: null, conyuge_nombre: null, conyuge_dni: null, calle: "Av. Siempreviva", numero: "742", localidad: "CABA", cp: "1425", created_at: "2026-07-20T00:00:00Z" },
  { id: 2, name: "Cliente Demostrativo N°2", dni: null, email: null, phone: "+54 9 11 1111 1111", fecha_nacimiento: null, profesion: null, estado_civil: null, conyuge_nombre: null, conyuge_dni: null, calle: null, numero: null, localidad: null, cp: null, created_at: "2026-09-01T00:00:00Z" },
  { id: 3, name: "Cliente Demostrativo N°3", dni: "28999111", email: "cliente3@demo.invalid", phone: "+54 9 11 2222 3333", fecha_nacimiento: "1980-05-14", profesion: "Comerciante", estado_civil: "casado", conyuge_nombre: "Cónyuge Demostrativo N°3", conyuge_dni: "29111444", calle: "Av. Ejemplo", numero: "1234", localidad: "Demo", cp: "1000", created_at: "2026-09-18T00:00:00Z" },
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
  { id: 3, name: "Cuenta Mariano", tipo: "banco", created_at: "2026-07-01T00:00:00Z" },
];

export const DEMO_OPERACIONES: Operacion[] = [
  {
    id: 1, pv_numero: "118", vendedor: "Mariano", vehiculo_id: 3, cliente_id: 1, fecha: "2026-09-15",
    moneda: "ars", precio_venta: 21000000, costo_transferencia: null, costo_formularios: null,
    costo_certificacion_firmas: null, costo_accesorios: null,
    permuta_dominio: null, permuta_marca: null, permuta_modelo: null, permuta_anio: null, permuta_km: null, permuta_precio: null,
    comentarios: null, forma_pago: "contado", estado: "entregada", created_at: "2026-09-15T00:00:00Z",
  },
  {
    id: 2, pv_numero: "122", vendedor: "Mariano", vehiculo_id: 2, cliente_id: 2, fecha: "2026-10-01",
    moneda: "ars", precio_venta: 9500000, costo_transferencia: null, costo_formularios: null,
    costo_certificacion_firmas: null, costo_accesorios: null,
    permuta_dominio: null, permuta_marca: null, permuta_modelo: null, permuta_anio: null, permuta_km: null, permuta_precio: null,
    comentarios: null, forma_pago: "financiado", estado: "confirmada", created_at: "2026-10-01T00:00:00Z",
  },
  {
    id: 3, pv_numero: "125", vendedor: "Mariano", vehiculo_id: 4, cliente_id: 3, fecha: "2026-10-03",
    moneda: "usd", precio_venta: 19000, costo_transferencia: null, costo_formularios: null,
    costo_certificacion_firmas: null, costo_accesorios: null,
    permuta_dominio: null, permuta_marca: null, permuta_modelo: null, permuta_anio: null, permuta_km: null, permuta_precio: null,
    comentarios: "Reserva sujeta a revisión técnica del mecánico del cliente.", forma_pago: "financiado", estado: "pendiente", created_at: "2026-10-03T00:00:00Z",
  },
];

export const DEMO_MOVIMIENTOS: Movimiento[] = [
  { id: 1, vehiculo_id: 3, operacion_id: 1, cuenta_id: 2, category_id: 1, amount: 21000000, moneda: "ars", tipo_cambio: null, modalidad: "transferencia", type: "ingreso", source: "manual", description: "Cobro venta Corolla", estado_categorizacion: "categorizado", fecha: "2026-09-15T00:00:00Z", created_at: "2026-09-15T00:00:00Z" },
  { id: 2, vehiculo_id: 2, operacion_id: 2, cuenta_id: 2, category_id: 2, amount: 2000000, moneda: "ars", tipo_cambio: null, modalidad: "transferencia", type: "ingreso", source: "manual", description: "Seña Gol Trend", estado_categorizacion: "categorizado", fecha: "2026-10-01T00:00:00Z", created_at: "2026-10-01T00:00:00Z" },
  { id: 3, vehiculo_id: 3, operacion_id: 1, cuenta_id: 1, category_id: 3, amount: 400000, moneda: "ars", tipo_cambio: null, modalidad: "efectivo", type: "egreso", source: "manual", description: "Comisión venta Corolla", estado_categorizacion: "categorizado", fecha: "2026-09-16T00:00:00Z", created_at: "2026-09-16T00:00:00Z" },
  { id: 4, vehiculo_id: null, operacion_id: null, cuenta_id: null, category_id: null, amount: 150000, moneda: "ars", tipo_cambio: null, modalidad: null, type: "egreso", source: "manual", description: "Transferencia sin clasificar", estado_categorizacion: "pendiente", fecha: "2026-10-05T00:00:00Z", created_at: "2026-10-05T00:00:00Z" },
  { id: 5, vehiculo_id: 4, operacion_id: 3, cuenta_id: 3, category_id: 2, amount: 1000, moneda: "usd", tipo_cambio: null, modalidad: "transferencia", type: "ingreso", source: "manual", description: "Seña reserva Peugeot 3008 (PV 125)", estado_categorizacion: "categorizado", fecha: "2026-10-03T00:00:00Z", created_at: "2026-10-03T00:00:00Z" },
];

export const DEMO_PUBLICACIONES: Publicacion[] = [
  { id: 1, vehiculo_id: 1, canal: "motordill", estado: "publicado", external_id: "DEMO-MTD-001", mensaje_error: null, actualizado_at: "2026-10-02T00:00:00Z", created_at: "2026-08-01T00:00:00Z" },
  { id: 2, vehiculo_id: 1, canal: "meta_catalogo", estado: "pendiente", external_id: null, mensaje_error: null, actualizado_at: "2026-08-01T00:00:00Z", created_at: "2026-08-01T00:00:00Z" },
  { id: 3, vehiculo_id: 2, canal: "motordill", estado: "error", external_id: null, mensaje_error: "Motordill: faltan variables de entorno: MOTORDILL_API_KEY", actualizado_at: "2026-09-12T00:00:00Z", created_at: "2026-08-10T00:00:00Z" },
];
