import { supabaseConfigurado } from "@/lib/supabase/client";
import LoginForm from "@/app/login/login-form";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const configurado = supabaseConfigurado();

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#f6f8fb]">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8">
        <div className="text-2xl font-bold text-[#17202b]">
          Castello<span className="text-[#60a5fa]">·</span>Gestión
        </div>
        <p className="mt-2 text-sm text-slate-500">
          Acceso al módulo de gestión —{" "}
          {configurado ? "autenticación con Supabase" : "modo demo (sin sesión)"}
        </p>

        <LoginForm next={next ?? "/"} />
      </div>
    </main>
  );
}
