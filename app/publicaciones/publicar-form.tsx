"use client";

import { useActionState } from "react";
import { publicarVehiculoAction } from "@/app/publicaciones/actions";
import { canalBadge } from "@/lib/ui/components";
import type { CanalPublicacion, Publicacion } from "@/lib/types/database";

export default function PublicarForm({
  vehiculoId,
  canal,
  publicacion,
  disabled,
}: {
  vehiculoId: number;
  canal: CanalPublicacion;
  publicacion: Publicacion | null;
  disabled: boolean;
}) {
  const [state, action, pending] = useActionState(publicarVehiculoAction, { ok: false, error: null });

  const estadoActual = state.ok ? "publicado" : state.error ? "error" : publicacion?.estado ?? "pendiente";
  const mensajeError = state.error ?? publicacion?.mensaje_error ?? null;

  return (
    <form action={action} className="flex flex-col items-start gap-1">
      <input type="hidden" name="vehiculo_id" value={vehiculoId} />
      <input type="hidden" name="canal" value={canal} />
      <div className="flex items-center gap-1.5">
        {canalBadge(estadoActual)}
        <button
          type="submit"
          disabled={disabled || pending}
          title={disabled ? "Solo se publican vehículos disponibles con precio cargado" : "Intentar publicar"}
          className="rounded-md bg-[#0f766e] px-2 py-1 text-xs font-semibold text-white hover:bg-[#0d5f57] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {pending ? "…" : estadoActual === "publicado" ? "Republicar" : "Publicar"}
        </button>
      </div>
      {mensajeError && <span className="max-w-[16rem] text-[0.65rem] text-red-500">{mensajeError}</span>}
    </form>
  );
}
