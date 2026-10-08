"use client";

import { useActionState } from "react";
import { eliminarFotoAction } from "@/app/vehiculos/[id]/fotos-actions";

export default function EliminarFotoForm({
  vehiculoId,
  fotoId,
  archivo,
  demo,
}: {
  vehiculoId: number;
  fotoId: number;
  archivo: string;
  demo: boolean;
}) {
  const [, action, pending] = useActionState(eliminarFotoAction, { ok: false, error: null });

  return (
    <form action={action}>
      <input type="hidden" name="vehiculo_id" value={vehiculoId} />
      <input type="hidden" name="foto_id" value={fotoId} />
      <input type="hidden" name="archivo" value={archivo} />
      <button
        type="submit"
        disabled={demo || pending}
        title={demo ? "Modo demo: solo lectura" : "Eliminar foto"}
        className="absolute right-1 top-1 rounded-full bg-black/60 px-1.5 py-0.5 text-[0.65rem] text-white hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
      >
        ✕
      </button>
    </form>
  );
}
