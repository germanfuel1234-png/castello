"use client";

import { useActionState } from "react";
import { registrarOperacionAction } from "@/app/operaciones/nueva/actions";
import type { Cliente, Vehiculo } from "@/lib/types/database";

export default function NuevaOperacionForm({
  vehiculos,
  clientes,
  demo,
}: {
  vehiculos: Vehiculo[];
  clientes: Cliente[];
  demo: boolean;
}) {
  const [state, action, pending] = useActionState(registrarOperacionAction, { ok: false, error: null });

  return (
    <form action={action} className="grid grid-cols-1 gap-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="form-label" htmlFor="pv_numero">N° de preventa (PV)</label>
          <input id="pv_numero" name="pv_numero" className="input-base" placeholder="125" />
        </div>
        <div className="col-span-2">
          <label className="form-label" htmlFor="vendedor">Vendedor</label>
          <input id="vendedor" name="vendedor" className="input-base" placeholder="Mariano" />
        </div>
      </div>

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

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="form-label" htmlFor="fecha">Fecha</label>
          <input id="fecha" name="fecha" type="date" required className="input-base" defaultValue={new Date().toISOString().slice(0, 10)} />
        </div>
        <div>
          <label className="form-label" htmlFor="precio_venta">Precio de venta</label>
          <input id="precio_venta" name="precio_venta" inputMode="decimal" required className="input-base" placeholder="19.000,00" />
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
        <label className="form-label" htmlFor="forma_pago">Forma de pago</label>
        <select id="forma_pago" name="forma_pago" className="input-base" required>
          <option value="contado">Contado</option>
          <option value="financiado">Financiado</option>
        </select>
      </div>

      <fieldset className="rounded-lg border border-slate-200 p-4">
        <legend className="form-label px-1">Costos adicionales (opcional)</legend>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label" htmlFor="costo_transferencia">Transferencia</label>
            <input id="costo_transferencia" name="costo_transferencia" inputMode="decimal" className="input-base" placeholder="0,00" />
          </div>
          <div>
            <label className="form-label" htmlFor="costo_formularios">Formularios</label>
            <input id="costo_formularios" name="costo_formularios" inputMode="decimal" className="input-base" placeholder="0,00" />
          </div>
          <div>
            <label className="form-label" htmlFor="costo_certificacion_firmas">Certificación de firmas</label>
            <input id="costo_certificacion_firmas" name="costo_certificacion_firmas" inputMode="decimal" className="input-base" placeholder="0,00" />
          </div>
          <div>
            <label className="form-label" htmlFor="costo_accesorios">Accesorios / Adicionales</label>
            <input id="costo_accesorios" name="costo_accesorios" inputMode="decimal" className="input-base" placeholder="0,00" />
          </div>
        </div>
      </fieldset>

      <fieldset className="rounded-lg border border-slate-200 p-4">
        <legend className="form-label px-1">Vehículo usado como parte de pago (opcional)</legend>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="form-label" htmlFor="permuta_marca">Marca</label>
            <input id="permuta_marca" name="permuta_marca" className="input-base" placeholder="Ford" />
          </div>
          <div>
            <label className="form-label" htmlFor="permuta_modelo">Modelo</label>
            <input id="permuta_modelo" name="permuta_modelo" className="input-base" placeholder="Focus" />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="form-label" htmlFor="permuta_dominio">Dominio</label>
            <input id="permuta_dominio" name="permuta_dominio" className="input-base" placeholder="AE555EE" />
          </div>
          <div>
            <label className="form-label" htmlFor="permuta_anio">Año</label>
            <input id="permuta_anio" name="permuta_anio" inputMode="numeric" className="input-base" placeholder="2015" />
          </div>
          <div>
            <label className="form-label" htmlFor="permuta_km">Km</label>
            <input id="permuta_km" name="permuta_km" inputMode="numeric" className="input-base" placeholder="95000" />
          </div>
          <div>
            <label className="form-label" htmlFor="permuta_precio">Valor asignado</label>
            <input id="permuta_precio" name="permuta_precio" inputMode="decimal" className="input-base" placeholder="0,00" />
          </div>
        </div>
      </fieldset>

      <div>
        <label className="form-label" htmlFor="comentarios">Comentarios</label>
        <textarea id="comentarios" name="comentarios" className="input-base" rows={2} placeholder="Ej: reserva sujeta a revisión técnica del mecánico del cliente." />
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
        title={demo ? "Modo demo: solo lectura (sin base de datos configurada)" : "Guardar operación"}
        className="rounded-lg bg-[#2563eb] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {demo ? "Guardar (requiere base de datos)" : "Guardar operación"}
      </button>

      {demo && (
        <div className="text-xs text-slate-400">
          En modo demo no se persiste nada. El formulario queda listo para operar con la base de datos.
        </div>
      )}
    </form>
  );
}
