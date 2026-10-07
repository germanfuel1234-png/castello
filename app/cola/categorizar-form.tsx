"use client";

import { useActionState } from "react";
import { categorizarMovimientoAction } from "@/app/cola/actions";
import type { Categoria, Movimiento, Vehiculo } from "@/lib/types/database";
import { modoDemo } from "@/lib/supabase/client";

export default function CategorizarForm({
  movement,
  vehiculos,
  cats,
}: {
  movement: Movimiento;
  vehiculos: Vehiculo[];
  cats: Categoria[];
}) {
  const [state, action, pending] = useActionState(categorizarMovimientoAction, { ok: false, error: null });

  const categorias = movement.type === "ingreso"
    ? cats.filter((c) => c.tipo === "ingreso")
    : cats.filter((c) => c.tipo === "egreso");

  return (
    <form action={action} className="flex flex-wrap items-center gap-1.5">
      <input type="hidden" name="movement_id" value={movement.id} />
      <select name="vehiculo_id" className="input-base !w-40 !py-1 text-xs" disabled={modoDemo()}>
        <option value="">Vehículo…</option>
        {vehiculos.map((v) => (
          <option key={v.id} value={v.id}>{v.marca} {v.modelo}</option>
        ))}
      </select>
      <select name="category_id" className="input-base !w-32 !py-1 text-xs" disabled={modoDemo()}>
        <option value="">Categoría…</option>
        {categorias.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
      <button
        type="submit"
        disabled={modoDemo() || pending}
        title={modoDemo() ? "Modo demo: solo lectura (sin credenciales Supabase)" : "Asignar y marcar como categorizado"}
        className="rounded-md bg-[#0f766e] px-2 py-1 text-xs font-semibold text-white hover:bg-[#0d5f57] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {pending ? "…" : "Aplicar"}
      </button>
      {state.error && <span className="text-[0.65rem] text-red-500" title={state.error}>⚠</span>}
      {state.ok && <span className="text-[0.65rem] text-[#0f766e]">✓</span>}
    </form>
  );
}
