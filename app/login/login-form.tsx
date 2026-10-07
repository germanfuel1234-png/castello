"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction } from "@/app/login/actions";
import { supabaseConfigurado } from "@/lib/supabase/client";

export default function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(loginAction, { error: null });
  const status = useFormStatus();
  void status;
  void pending;

  const metodoDemo = !supabaseConfigurado();

  return (
    <form action={action} className="mt-6 space-y-4">
      <input type="hidden" name="next" value={next} />
      <div>
        <label className="form-label" htmlFor="email">
          Email
        </label>
        <input id="email" name="email" type="email" required className="input-base" placeholder="vos@ejemplo.com" />
      </div>
      <div>
        <label className="form-label" htmlFor="password">
          Contraseña
        </label>
        <input id="password" name="password" type="password" required className="input-base" placeholder="••••••••" />
      </div>

      {state.error && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">{state.error}</div>
      )}

      {metodoDemo ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
          Estás en <strong>modo demo</strong>: no hay proyecto Supabase creado todavía, así que no se
          puede iniciar sesión por ahora. Usá la app directamente desde el menú o{" "}
          <a href="/" className="text-[#0f766e] underline">volvé al resumen</a>.
        </div>
      ) : (
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-[#2563eb] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1d4ed8] disabled:opacity-50"
        >
          {pending ? "Ingresando…" : "Ingresar"}
        </button>
      )}
    </form>
  );
}
