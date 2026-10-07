import { describe, expect, it } from "vitest";
import {
  categorizarMovimiento,
  contarPendientes,
  movimientosPendientes,
} from "@/lib/business/cola-pendientes";
import type { Movimiento } from "@/lib/types/database";

const base: Movimiento = {
  id: 1,
  vehiculo_id: null,
  operacion_id: null,
  cuenta_id: 1,
  category_id: null,
  amount: 100,
  type: "ingreso",
  source: "manual",
  description: "sin categorizar",
  estado_categorizacion: "pendiente",
  fecha: "2026-01-01",
  created_at: "2026-01-01T00:00:00Z",
};

describe("Cola de movimientos pendientes de categorizar", () => {
  it("filtra solo los pendientes", () => {
    const pendientes = movimientosPendientes([base, { ...base, id: 2, estado_categorizacion: "categorizado" }]);
    expect(pendientes.map((m) => m.id)).toEqual([1]);
  });

  it("cuenta pendientes para badge", () => {
    expect(contarPendientes([base, base])).toBe(2);
  });

  it("categoriza correctamente con vehículo + categoría", () => {
    const { mov, errores } = categorizarMovimiento(base, { vehiculo_id: 3, category_id: 1 });
    expect(errores).toEqual([]);
    expect(mov.vehiculo_id).toBe(3);
    expect(mov.category_id).toBe(1);
    expect(mov.estado_categorizacion).toBe("categorizado");
  });

  it("rechaza categorización sin categoría", () => {
    const { errores } = categorizarMovimiento(base, { vehiculo_id: 1, category_id: null });
    expect(errores).toContain("Falta asignar categoría");
  });

  it("no modifica el movimiento si hay errores de validación", () => {
    const { mov } = categorizarMovimiento(base, { vehiculo_id: null, category_id: null });
    expect(mov.estado_categorizacion).toBe("pendiente");
  });
});
