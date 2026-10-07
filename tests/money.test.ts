import { describe, expect, it } from "vitest";
import { formatMoney, parseAmount, redondear2 } from "@/lib/business/money";

describe("formatMoney", () => {
  it("formatea en pesos argentinos con separador de miles", () => {
    expect(formatMoney(1234567)).toBe("$1.234.567,00");
  });

  it("usa signo menos para negativos", () => {
    expect(formatMoney(-500)).toBe("−$500,00");
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
