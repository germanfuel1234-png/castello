"use client";

import { useActionState, useState } from "react";
import { subirFotosAction } from "@/app/vehiculos/[id]/fotos-actions";

export default function FotosForm({ vehiculoId, demo }: { vehiculoId: number; demo: boolean }) {
  const [state, action, pending] = useActionState(subirFotosAction, { ok: false, error: null });
  const [previews, setPreviews] = useState<string[]>([]);

  return (
    <form
      action={action}
      className="flex flex-col gap-3"
      onChange={(e) => {
        const input = (e.currentTarget.elements.namedItem("fotos") as HTMLInputElement) ?? null;
        const files = input?.files ? [...input.files] : [];
        setPreviews(files.map((f) => URL.createObjectURL(f)));
      }}
    >
      <input type="hidden" name="vehiculo_id" value={vehiculoId} />
      <input
        type="file"
        name="fotos"
        accept="image/jpeg,image/png,image/webp"
        multiple
        disabled={demo}
        className="text-sm"
      />

      {previews.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {previews.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt="" className="h-16 w-16 rounded-md object-cover border border-slate-200" />
          ))}
        </div>
      )}

      <button
        type="submit"
        disabled={demo || pending}
        title={demo ? "Modo demo: solo lectura (sin base de datos configurada)" : "Subir fotos seleccionadas"}
        className="self-start rounded-lg bg-[#2563eb] px-3 py-1.5 text-sm font-semibold text-white hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Subiendo…" : "Subir fotos"}
      </button>

      {state.error && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          {state.error}
        </div>
      )}
      {state.ok && <div className="text-xs text-[#0f766e]">Fotos subidas. ✓</div>}
    </form>
  );
}
