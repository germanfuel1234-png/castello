"use client";

import { useActionState } from "react";
import { registrarVehiculoAction } from "@/app/vehiculos/nuevo/actions";
import { modoDemo } from "@/lib/supabase/client";

export default function NuevoVehiculoForm() {
  const [state, action, pending] = useActionState(registrarVehiculoAction, { ok: false, error: null });
  const demo = modoDemo();

  return (
    <form action={action} className="grid grid-cols-1 gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label" htmlFor="marca">Marca</label>
          <input id="marca" name="marca" required className="input-base" placeholder="Chevrolet" />
        </div>
        <div>
          <label className="form-label" htmlFor="modelo">Modelo</label>
          <input id="modelo" name="modelo" required className="input-base" placeholder="Onix" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="form-label" htmlFor="anio">Año</label>
          <input id="anio" name="anio" inputMode="numeric" className="input-base" placeholder="2021" />
        </div>
        <div>
          <label className="form-label" htmlFor="patente">Patente</label>
          <input id="patente" name="patente" className="input-base" placeholder="AA000AA" />
        </div>
        <div>
          <label className="form-label" htmlFor="km">Kilometraje</label>
          <input id="km" name="km" inputMode="numeric" className="input-base" placeholder="42000" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="form-label" htmlFor="color">Color</label>
          <input id="color" name="color" className="input-base" placeholder="Blanco" />
        </div>
        <div>
          <label className="form-label" htmlFor="combustible">Combustible</label>
          <select id="combustible" name="combustible" className="input-base">
            <option value="">Seleccionar…</option>
            <option value="nafta">Nafta</option>
            <option value="diesel">Diésel</option>
            <option value="gnc">GNC</option>
            <option value="electrico">Eléctrico</option>
            <option value="hibrido">Híbrido</option>
          </select>
        </div>
        <div>
          <label className="form-label" htmlFor="transmision">Transmisión</label>
          <select id="transmision" name="transmision" className="input-base">
            <option value="">Seleccionar…</option>
            <option value="manual">Manual</option>
            <option value="automatica">Automática</option>
          </select>
        </div>
      </div>

      <div>
        <label className="form-label" htmlFor="precio">Precio (ARS)</label>
        <input id="precio" name="precio" inputMode="decimal" className="input-base" placeholder="12.000.000,00" />
      </div>

      {state.error && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">{state.error}</div>
      )}
      {state.ok && (
        <div className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-800">
          Vehículo guardado. ✓
        </div>
      )}

      <button
        type="submit"
        disabled={demo || pending}
        title={demo ? "Modo demo: solo lectura (sin credenciales Supabase)" : "Guardar vehículo"}
        className="rounded-lg bg-[#2563eb] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {demo ? "Guardar (requiere Supabase)" : "Guardar vehículo"}
      </button>

      {demo && (
        <div className="text-xs text-slate-400">
          En modo demo no se persiste nada. El formulario queda listo para operar con Supabase.
        </div>
      )}
    </form>
  );
}
