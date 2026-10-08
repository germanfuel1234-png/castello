import type { Moneda } from "@/lib/types/database";

/**
 * Formato y utilidades de montos. El negocio opera en dos monedas
 * (ARS y USD, según la operación) — no se pueden sumar montos de
 * distinta moneda directamente, hay que agruparlos primero
 * (ver `sumarPorMoneda`). Los montos se guardan como numeric(12,2) —
 * no usar flotantes sin redondear en cálculos de negocio.
 */

const SIMBOLOS: Record<Moneda, string> = {
  ars: "$",
  usd: "US$",
};

export function formatMoney(amount: number, moneda: Moneda = "ars", decimals = 2): string {
  const signo = amount < 0 ? "−" : "";
  const cuerpo = Math.abs(amount).toLocaleString("es-AR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${signo}${SIMBOLOS[moneda]}${cuerpo}`;
}

export type MontosPorMoneda = Partial<Record<Moneda, number>>;

/** Suma montos agrupando por moneda — nunca se mezclan ARS con USD en un mismo total. */
export function sumarPorMoneda<T extends { amount: number; moneda: Moneda }>(items: T[]): MontosPorMoneda {
  const totales: MontosPorMoneda = {};
  for (const item of items) {
    totales[item.moneda] = (totales[item.moneda] ?? 0) + item.amount;
  }
  return totales;
}

/** Formatea un total por moneda como texto, ej: "US$18.000,00 + $45.000,00". */
export function formatMontosPorMoneda(totales: MontosPorMoneda): string {
  const partes = (Object.entries(totales) as [Moneda, number][])
    .filter(([, monto]) => monto !== 0)
    .map(([moneda, monto]) => formatMoney(monto, moneda));
  return partes.length > 0 ? partes.join(" + ") : formatMoney(0);
}

/** Parsea "1.234,56" o "1234.56" (es-AR) a número. */
export function parseAmount(input: string): number | null {
  if (!input) return null;
  const normalizado = input.trim().replace(/\./g, "").replace(",", ".");
  const n = Number(normalizado);
  if (Number.isNaN(n)) return null;
  return redondear2(n);
}

/** Redondeo bancario a 2 decimales (evita errores de punto flotante). */
export function redondear2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
