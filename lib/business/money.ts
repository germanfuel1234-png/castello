/**
 * Formato y utilidades de montos.
 * Una sola moneda: pesos argentinos (ARS). Los montos se guardan como
 * numeric(12,2) — no usar flotantes sin redondear en cálculos de negocio.
 */

export function formatMoney(amount: number, decimals = 2): string {
  const signo = amount < 0 ? "−" : "";
  const cuerpo = Math.abs(amount).toLocaleString("es-AR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${signo}$${cuerpo}`;
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
