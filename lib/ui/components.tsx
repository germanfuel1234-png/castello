import { modoDemo } from "@/lib/supabase/client";
import type { Categoria, Cuenta, Vehiculo } from "@/lib/types/database";
import { formatMoney } from "@/lib/business/money";

export function pageTitle(titulo: string, subtitulo?: string) {
  return (
    <header className="mb-6">
      <h1 className="text-xl font-bold text-[#17202b]">{titulo}</h1>
      {subtitulo ? <p className="mt-1 text-sm text-slate-500">{subtitulo}</p> : null}
    </header>
  );
}

export function demoBanner() {
  if (!modoDemo()) return null;
  return (
    <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      <strong>Modo demo.</strong> No hay credenciales de Supabase configuradas todavía.
      Mostrando <em>datos ficticios</em> de ejemplo, no datos reales del negocio.
    </div>
  );
}

export function statCard(label: string, value: string, hint?: string, color = "text-[#17202b]") {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-[0.7rem] uppercase tracking-wide text-slate-400">{label}</div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      {hint ? <div className="text-xs text-slate-400">{hint}</div> : null}
    </div>
  );
}

export function estadoBadge(estado: string) {
  switch (estado) {
    case "disponible":
      return <span className="badge badge-slate">○ Disponible</span>;
    case "reservado":
      return <span className="badge badge-amber">◐ Reservado</span>;
    case "vendido":
      return <span className="badge badge-green">● Vendido</span>;
    case "pendiente":
      return <span className="badge badge-amber">Pendiente</span>;
    case "confirmada":
      return <span className="badge badge-amber">Confirmada</span>;
    case "entregada":
      return <span className="badge badge-green">Entregada</span>;
    case "categorizado":
      return <span className="badge badge-green">Categorizado</span>;
    case "ingreso":
      return <span className="badge badge-green">Ingreso</span>;
    case "egreso":
      return <span className="badge badge-coral">Egreso</span>;
    case "contado":
      return <span className="badge badge-slate">Contado</span>;
    case "financiado":
      return <span className="badge badge-amber">Financiado</span>;
    default:
      return <span className="badge badge-slate">{estado}</span>;
  }
}

export function montoMovimiento(m: { amount: number; type: string }) {
  const clase = m.type === "ingreso" ? "text-[#0f766e]" : "text-[#b91c1c]";
  const signo = m.type === "ingreso" ? "+" : "−";
  return (
    <span className={`font-mono text-sm ${clase}`}>
      {signo}
      {formatMoney(Math.abs(m.amount))}
    </span>
  );
}

export function nombreVehiculo(id: number | null, vehiculos: Vehiculo[]): string {
  if (!id) return "—";
  const v = vehiculos.find((x) => x.id === id);
  return v ? `${v.marca} ${v.modelo}${v.patente ? ` (${v.patente})` : ""}` : `Vehículo #${id}`;
}

export function nombreCategoria(id: number | null, cats: Categoria[]): string {
  if (!id) return "—";
  return cats.find((c) => c.id === id)?.name ?? `Cat.#${id}`;
}

export function nombreCuenta(id: number | null, cuentas: Cuenta[]): string {
  if (!id) return "—";
  return cuentas.find((c) => c.id === id)?.name ?? `Cuenta #${id}`;
}
