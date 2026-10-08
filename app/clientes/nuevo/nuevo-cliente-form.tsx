"use client";

import { useActionState } from "react";
import { registrarClienteAction } from "@/app/clientes/nuevo/actions";

export default function NuevoClienteForm({ demo }: { demo: boolean }) {
  const [state, action, pending] = useActionState(registrarClienteAction, { ok: false, error: null });

  return (
    <form action={action} className="grid grid-cols-1 gap-4">
      <div>
        <label className="form-label" htmlFor="name">Nombre y apellido</label>
        <input id="name" name="name" required className="input-base" placeholder="Juan Pérez" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label" htmlFor="dni">DNI</label>
          <input id="dni" name="dni" inputMode="numeric" className="input-base" placeholder="30111222" />
        </div>
        <div>
          <label className="form-label" htmlFor="phone">Teléfono</label>
          <input id="phone" name="phone" className="input-base" placeholder="+54 9 11 0000 0000" />
        </div>
      </div>

      <div>
        <label className="form-label" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" className="input-base" placeholder="juan@ejemplo.com" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label" htmlFor="fecha_nacimiento">Fecha de nacimiento</label>
          <input id="fecha_nacimiento" name="fecha_nacimiento" type="date" className="input-base" />
        </div>
        <div>
          <label className="form-label" htmlFor="profesion">Profesión</label>
          <input id="profesion" name="profesion" className="input-base" placeholder="Docente" />
        </div>
      </div>

      <div>
        <label className="form-label" htmlFor="estado_civil">Estado civil</label>
        <select id="estado_civil" name="estado_civil" className="input-base">
          <option value="">Seleccionar…</option>
          <option value="soltero">Soltero/a</option>
          <option value="casado">Casado/a</option>
          <option value="union_convivencial">Unión convivencial</option>
          <option value="divorciado">Divorciado/a</option>
          <option value="viudo">Viudo/a</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label" htmlFor="conyuge_nombre">Cónyuge — Nombre (si corresponde)</label>
          <input id="conyuge_nombre" name="conyuge_nombre" className="input-base" placeholder="María Pérez" />
        </div>
        <div>
          <label className="form-label" htmlFor="conyuge_dni">Cónyuge — DNI</label>
          <input id="conyuge_dni" name="conyuge_dni" inputMode="numeric" className="input-base" placeholder="30222333" />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-2">
          <label className="form-label" htmlFor="calle">Calle</label>
          <input id="calle" name="calle" className="input-base" placeholder="Av. Siempreviva" />
        </div>
        <div>
          <label className="form-label" htmlFor="numero">Número</label>
          <input id="numero" name="numero" className="input-base" placeholder="742" />
        </div>
        <div>
          <label className="form-label" htmlFor="cp">C.P.</label>
          <input id="cp" name="cp" className="input-base" placeholder="1425" />
        </div>
      </div>

      <div>
        <label className="form-label" htmlFor="localidad">Localidad</label>
        <input id="localidad" name="localidad" className="input-base" placeholder="CABA" />
      </div>

      {state.error && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">{state.error}</div>
      )}
      {state.ok && (
        <div className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-800">
          Cliente guardado. ✓
        </div>
      )}

      <button
        type="submit"
        disabled={demo || pending}
        title={demo ? "Modo demo: solo lectura (sin base de datos configurada)" : "Guardar cliente"}
        className="rounded-lg bg-[#2563eb] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {demo ? "Guardar (requiere base de datos)" : "Guardar cliente"}
      </button>

      {demo && (
        <div className="text-xs text-slate-400">
          En modo demo no se persiste nada. El formulario queda listo para operar con la base de datos.
        </div>
      )}
    </form>
  );
}
