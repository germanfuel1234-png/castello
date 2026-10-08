import { describe, expect, it } from "vitest";
import { formatMoney, formatMontosPorMoneda, parseAmount, redondear2, sumarPorMoneda } from "@/lib/business/money";

describe("formatMoney", () => {
  it("formatea en pesos argentinos con separador de miles", () => {
    expect(formatMoney(1234567)).toBe("$1.234.567,00");
  });

  it("formatea en dólares con el prefijo US$", () => {
    expect(formatMoney(19000, "usd")).toBe("US$19.000,00");
  });

  it("usa signo menos para negativos", () => {
    expect(formatMoney(-500)).toBe("−$500,00");
  });
});

describe("sumarPorMoneda / formatMontosPorMoneda", () => {
  it("agrupa montos por moneda sin mezclarlos", () => {
    const totales = sumarPorMoneda([
      { amount: 100, moneda: "ars" as const },
      { amount: 50, moneda: "ars" as const },
      { amount: 1000, moneda: "usd" as const },
    ]);
    expect(totales).toEqual({ ars: 150, usd: 1000 });
  });

  it("formatea varias monedas juntas, omitiendo las que están en cero", () => {
    expect(formatMontosPorMoneda({ ars: 150, usd: 0 })).toBe("$150,00");
    expect(formatMontosPorMoneda({ ars: 150, usd: 1000 })).toBe("$150,00 + US$1.000,00");
  });

  it("devuelve $0,00 cuando no hay montos", () => {
    expect(formatMontosPorMoneda({})).toBe("$0,00");
  });
});

describe("parseAmount", () => {
  it("parsea formato es-AR", () => {
    expect(parseAmount("1.234.567,00")).toBe(1234567);
  });

  it("devuelve null para entradas inválidas", () => {
    expect(parseAmount("abc")).toBeNull();
  });
});

describe("redondear2", () => {
  it("redondea a 2 decimales evitando errores de flotante", () => {
    expect(redondear2(10.005)).toBeCloseTo(10.01, 2);
  });
});
