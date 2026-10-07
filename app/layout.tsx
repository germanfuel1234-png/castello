import type { Metadata } from "next";
import "./globals.css";
import { SIDEBAR_LINKS } from "@/lib/ui/nav";
import { getCurrentUser } from "@/lib/supabase/auth";
import { modoDemo } from "@/lib/supabase/client";

export const metadata: Metadata = {
  title: "Castello · Gestión",
  description: "Sistema de gestión centralizado — Castello (Fase 1)",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <html lang="es">
      <body>
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-64 shrink-0 bg-[#17202b] text-white sticky top-0 h-screen overflow-y-auto">
            <div className="px-5 py-5">
              <div className="text-lg font-bold tracking-tight">
                Castello<span className="text-[#60a5fa]">·</span>Gestión
              </div>
              <div className="text-[0.65rem] mt-1 text-slate-300">Fase 1 — Módulo de gestión</div>
            </div>
            <nav className="mt-2 space-y-1 px-3">
              {SIDEBAR_LINKS.map((grupo) => (
                <div key={grupo.titulo}>
                  <div className="px-2 pt-2 text-[0.65rem] uppercase tracking-wider text-slate-400">
                    {grupo.titulo}
                  </div>
                  {grupo.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-slate-200 hover:bg-[#232e3d] hover:text-white"
                    >
                      <span className="w-4 text-center text-[#60a5fa] text-xs">{link.icono}</span>
                      {link.label}
                    </a>
                  ))}
                </div>
              ))}
            </nav>

            {/* Estado de sesión */}
            <div className="mt-5 px-4 py-3 rounded-lg bg-[#1f2937] text-[0.7rem] text-slate-300 leading-relaxed">
              {modoDemo() ? (
                <>
                  🔒 <strong>Modo demo</strong> · sesión desactivada (falta proyecto Supabase).
                  <a href="/login" className="underline text-[#60a5fa]">Ver pantalla de login</a>
                </>
              ) : user ? (
                <>
                  👤 {user.email ?? "usuario"}
                  <form method="post" action="/logout" className="mt-2">
                    <button type="submit" className="underline hover:text-white">Cerrar sesión</button>
                  </form>
                </>
              ) : (
                <a href="/login" className="underline text-[#60a5fa]">Iniciar sesión</a>
              )}
            </div>
          </aside>

          {/* Contenido */}
          <main className="flex-1 min-w-0 px-6 py-6 max-h-full">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
