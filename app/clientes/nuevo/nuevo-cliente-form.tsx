"use client";

import { useActionState } from "react";
import { registrarClienteAction } from "@/app/clientes/nuevo/actions";
import { modoDemo } from "@/lib/supabase/client";

export default function NuevoClienteForm() {
  const [state, action, pending] = useActionState(registrarClienteAction, { ok: false, error: null });
  const demo = modoDemo();

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

      <div>
        <label className="form-label" htmlFor="address">Dirección</label>
        <input id="address" name="address" className="input-base" placeholder="Av. Siempreviva 742, CABA" />
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
        title={demo ? "Modo demo: solo lectura (sin credenciales Supabase)" : "Guardar cliente"}
        className="rounded-lg bg-[#2563eb] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {demo ? "Guardar (requiere Supabase)" : "Guardar cliente"}
      </button>

      {demo && (
        <div className="text-xs text-slate-400">
          En modo demo no se persiste nada. El formulario queda listo para operar con Supabase.
        </div>
      )}
    </form>
  );
}
