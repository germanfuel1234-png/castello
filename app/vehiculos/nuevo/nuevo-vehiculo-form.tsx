"use client";

import { useActionState } from "react";
import { registrarVehiculoAction } from "@/app/vehiculos/nuevo/actions";

export default function NuevoVehiculoForm({ demo }: { demo: boolean }) {
  const [state, action, pending] = useActionState(registrarVehiculoAction, { ok: false, error: null });

  return (
    <form action={action} className="grid grid-cols-1 gap-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="form-label" htmlFor="marca">Marca</label>
          <input id="marca" name="marca" required className="input-base" placeholder="Chevrolet" />
        </div>
        <div>
          <label className="form-label" htmlFor="modelo">Modelo</label>
          <input id="modelo" name="modelo" required className="input-base" placeholder="Onix" />
        </div>
        <div>
          <label className="form-label" htmlFor="version">Versión</label>
          <input id="version" name="version" className="input-base" placeholder="Joy 1.2" />
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

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="form-label" htmlFor="tipo_carroceria">Tipo de carrocería</label>
          <select id="tipo_carroceria" name="tipo_carroceria" className="input-base">
            <option value="">Seleccionar…</option>
            <option value="sedan">Sedán</option>
            <option value="hatchback">Hatchback</option>
            <option value="suv">SUV</option>
            <option value="pickup">Pickup</option>
            <option value="furgon">Furgón</option>
            <option value="coupe">Coupé</option>
            <option value="rural">Rural</option>
            <option value="otro">Otro</option>
          </select>
        </div>
        <div>
          <label className="form-label" htmlFor="puertas">Puertas</label>
          <input id="puertas" name="puertas" inputMode="numeric" className="input-base" placeholder="4" />
        </div>
        <div>
          <label className="form-label" htmlFor="motor">Motor</label>
          <input id="motor" name="motor" className="input-base" placeholder="2.0" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="form-label" htmlFor="direccion">Dirección</label>
          <select id="direccion" name="direccion" className="input-base">
            <option value="">Seleccionar…</option>
            <option value="mecanica">Mecánica</option>
            <option value="hidraulica">Hidráulica</option>
            <option value="electrica">Eléctrica</option>
          </select>
        </div>
        <div>
          <label className="form-label" htmlFor="cargado_por">Cargado por</label>
          <select id="cargado_por" name="cargado_por" className="input-base">
            <option value="">Seleccionar…</option>
            <option value="mariano">Mariano</option>
            <option value="leandro">Leandro</option>
          </select>
        </div>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" name="acepta_permuta" className="h-4 w-4" />
          Acepta permuta
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" name="precio_negociable" className="h-4 w-4" />
          Precio negociable
        </label>
      </div>

      <div>
        <label className="form-label" htmlFor="descripcion">Descripción (para publicaciones)</label>
        <textarea id="descripcion" name="descripcion" rows={3} className="input-base" placeholder="Único dueño, service oficial al día, documentación al día…" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <label className="form-label" htmlFor="precio">Precio</label>
          <input id="precio" name="precio" inputMode="decimal" className="input-base" placeholder="12.000.000,00" />
        </div>
        <div>
          <label className="form-label" htmlFor="moneda">Moneda</label>
          <select id="moneda" name="moneda" className="input-base" defaultValue="ars">
            <option value="ars">ARS</option>
            <option value="usd">USD</option>
          </select>
        </div>
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
        title={demo ? "Modo demo: solo lectura (sin base de datos configurada)" : "Guardar vehículo"}
        className="rounded-lg bg-[#2563eb] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {demo ? "Guardar (requiere base de datos)" : "Guardar vehículo"}
      </button>

      {demo && (
        <div className="text-xs text-slate-400">
          En modo demo no se persiste nada. El formulario queda listo para operar con la base de datos.
        </div>
      )}
    </form>
  );
}
