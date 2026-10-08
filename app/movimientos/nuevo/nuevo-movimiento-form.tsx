"use client";

import { useActionState } from "react";
import { registrarMovimientoManualAction } from "@/app/movimientos/nuevo/actions";
import type { Categoria, Cuenta, Vehiculo } from "@/lib/types/database";

export default function NuevoMovimientoForm({
  vehiculos,
  cats,
  cuentas,
  demo,
}: {
  vehiculos: Vehiculo[];
  cats: Categoria[];
  cuentas: Cuenta[];
  demo: boolean;
}) {
  const [state, action, pending] = useActionState(registrarMovimientoManualAction, { ok: false, error: null });

  return (
    <form action={action} className="grid grid-cols-1 gap-4">
      <div>
        <label className="form-label" htmlFor="tipo">Tipo</label>
        <select id="tipo" name="type" className="input-base" required>
          <option value="ingreso">Ingreso</option>
          <option value="egreso">Egreso</option>
        </select>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="form-label" htmlFor="fecha">Fecha</label>
          <input id="fecha" name="fecha" type="date" required className="input-base" defaultValue={new Date().toISOString().slice(0, 10)} />
        </div>
        <div>
          <label className="form-label" htmlFor="amount">Monto</label>
          <input id="amount" name="amount" inputMode="decimal" required className="input-base" placeholder="450.000,00" />
        </div>
        <div>
          <label className="form-label" htmlFor="moneda">Moneda</label>
          <select id="moneda" name="moneda" className="input-base" defaultValue="ars">
            <option value="ars">ARS</option>
            <option value="usd">USD</option>
          </select>
        </div>
      </div>

      <div>
        <label className="form-label" htmlFor="description">Descripción</label>
        <input id="description" name="description" className="input-base" placeholder="Ej: Comisión venta Corolla" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label" htmlFor="vehiculo_id">Vehículo (opcional)</label>
          <select id="vehiculo_id" name="vehiculo_id" className="input-base">
            <option value="">Sin asignar</option>
            {vehiculos.map((v) => (
              <option key={v.id} value={v.id}>{v.marca} {v.modelo}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label" htmlFor="category_id">Categoría</label>
          <select id="category_id" name="category_id" className="input-base" required>
            <option value="">Seleccionar…</option>
            {cats.map((c) => (
              <option key={c.id} value={c.id}>{c.name} ({c.tipo})</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="form-label" htmlFor="cuenta_id">Cuenta</label>
          <select id="cuenta_id" name="cuenta_id" className="input-base" defaultValue={cuentas.find((c) => c.tipo === "efectivo")?.id}>
            {cuentas.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label" htmlFor="modalidad">Modalidad</label>
          <select id="modalidad" name="modalidad" className="input-base">
            <option value="">Seleccionar…</option>
            <option value="efectivo">Efectivo</option>
            <option value="transferencia">Transferencia</option>
            <option value="cheque">Cheque</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="otro">Otro</option>
          </select>
        </div>
        <div>
          <label className="form-label" htmlFor="tipo_cambio">Tipo de cambio (opcional)</label>
          <input id="tipo_cambio" name="tipo_cambio" inputMode="decimal" className="input-base" placeholder="Si hubo conversión" />
        </div>
      </div>

      {state.error && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">{state.error}</div>
      )}
      {state.ok && (
        <div className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-800">
          Movimiento guardado. ✓
        </div>
      )}

      <button
        type="submit"
        disabled={demo || pending}
        title={demo ? "Modo demo: solo lectura (sin base de datos configurada)" : "Guardar movimiento"}
        className="rounded-lg bg-[#2563eb] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {demo ? "Guardar (requiere base de datos)" : "Guardar movimiento"}
      </button>

      {demo && (
        <div className="text-xs text-slate-400">
          En modo demo no se persiste nada. El formulario queda listo para operar con la base de datos.
        </div>
      )}
    </form>
  );
}
