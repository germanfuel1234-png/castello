import { repo } from "@/lib/data/repository";
import { demoBanner, pageTitle } from "@/lib/ui/components";
import { formatMoney } from "@/lib/business/money";

export const dynamic = "force-dynamic";

export default async function DashboardCategoriaPage() {
  const [cats, movs] = await Promise.all([repo.getCategorias(), repo.getMovimientos()]);

  const ingresos = cats.filter((c) => c.tipo === "ingreso").map((c) => ({
    cat: c,
    total: movs.filter((m) => m.category_id === c.id && m.type === "ingreso").reduce((a, m) => a + m.amount, 0),
  }));
  const egresos = cats.filter((c) => c.tipo === "egreso").map((c) => ({
    cat: c,
    total: movs.filter((m) => m.category_id === c.id && m.type === "egreso").reduce((a, m) => a + m.amount, 0),
  }));

  const maxIng = Math.max(1, ...ingresos.map((i) => i.total));
  const maxEg = Math.max(1, ...egresos.map((e) => e.total));

  return (
    <main>
      {demoBanner()}
      {pageTitle("Dashboard por categoría", "Desglose de ingresos y egresos del negocio.")}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-600 mb-3">Ingresos por categoría</h2>
          {ingresos.map(({ cat, total }) => (
            <div key={cat.id} className="flex items-center justify-between py-2">
              <div className="w-48 text-sm truncate" title={cat.description ?? cat.name}>{cat.name}</div>
              <div className="h-3 flex-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-[#2dd4bf] h-full" style={{ width: `${(total / maxIng) * 100}%` }} />
              </div>
              <div className="w-28 text-right font-mono text-sm">{formatMoney(total)}</div>
            </div>
          ))}
          {ingresos.length === 0 && <div className="text-xs italic text-slate-400">Sin categorías de ingreso.</div>}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-600 mb-3">Egresos por categoría</h2>
          {egresos.map(({ cat, total }) => (
            <div key={cat.id} className="flex items-center justify-between py-2">
              <div className="w-48 text-sm truncate" title={cat.description ?? cat.name}>{cat.name}</div>
              <div className="h-3 flex-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-[#60a5fa] h-full" style={{ width: `${Math.min(100, (total / maxEg) * 100)}%` }} />
              </div>
              <div className="w-28 text-right font-mono text-sm">{formatMoney(total)}</div>
            </div>
          ))}
          {egresos.length === 0 && <div className="text-xs italic text-slate-400">Sin categorías de egreso.</div>}
        </section>
      </div>

      <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
        Categorías iniciales (ejemplo, a ajustar con Mariano): Venta de unidad, Señas/anticipos, Comisión vendedor,
        Preparación/service, Marketing, Gastos generales. La categorización de movimientos automatizados ocurre
        en la <a href="/cola" className="text-[#0f766e] underline">cola de pendientes</a>.
      </div>
    </main>
  );
}
