"use client";

import { useActionState } from "react";
import { registrarOperacionAction } from "@/app/operaciones/nueva/actions";
import type { Cliente, Vehiculo } from "@/lib/types/database";
import { modoDemo } from "@/lib/supabase/client";

export default function NuevaOperacionForm({
  vehiculos,
  clientes,
}: {
  vehiculos: Vehiculo[];
  clientes: Cliente[];
}) {
  const [state, action, pending] = useActionState(registrarOperacionAction, { ok: false, error: null });
  const demo = modoDemo();

  return (
    <form action={action} className="grid grid-cols-1 gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label" htmlFor="vehiculo_id">Vehículo</label>
          <select id="vehiculo_id" name="vehiculo_id" className="input-base" required>
            <option value="">Seleccionar…</option>
            {vehiculos.map((v) => (
              <option key={v.id} value={v.id}>{v.marca} {v.modelo} {v.patente ? `(${v.patente})` : ""}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label" htmlFor="cliente_id">Cliente</label>
          <select id="cliente_id" name="cliente_id" className="input-base" required>
            <option value="">Seleccionar…</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label" htmlFor="fecha">Fecha</label>
          <input id="fecha" name="fecha" type="date" required className="input-base" defaultValue={new Date().toISOString().slice(0, 10)} />
        </div>
        <div>
          <label className="form-label" htmlFor="precio_venta">Precio de venta (ARS)</label>
          <input id="precio_venta" name="precio_venta" inputMode="decimal" required className="input-base" placeholder="12.000.000,00" />
        </div>
      </div>

      <div>
        <label className="form-label" htmlFor="forma_pago">Forma de pago</label>
        <select id="forma_pago" name="forma_pago" className="input-base" required>
          <option value="contado">Contado</option>
          <option value="financiado">Financiado</option>
        </select>
      </div>

      {state.error && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">{state.error}</div>
      )}
      {state.ok && (
        <div className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-800">
          Operación guardada. ✓
        </div>
      )}

      <button
        type="submit"
        disabled={demo || pending}
        title={demo ? "Modo demo: solo lectura (sin credenciales Supabase)" : "Guardar operación"}
        className="rounded-lg bg-[#2563eb] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {demo ? "Guardar (requiere Supabase)" : "Guardar operación"}
      </button>

      {demo && (
        <div className="text-xs text-slate-400">
          En modo demo no se persiste nada. El formulario queda listo para operar con Supabase.
        </div>
      )}
    </form>
  );
}
