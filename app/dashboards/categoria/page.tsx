import { repo } from "@/lib/data/repository";
import { demoBanner, pageTitle } from "@/lib/ui/components";
import { formatMontosPorMoneda, sumarPorMoneda } from "@/lib/business/money";

export const dynamic = "force-dynamic";

export default async function DashboardCategoriaPage() {
  const [cats, movs] = await Promise.all([repo.getCategorias(), repo.getMovimientos()]);

  const ingresos = cats.filter((c) => c.tipo === "ingreso").map((c) => ({
    cat: c,
    totales: sumarPorMoneda(movs.filter((m) => m.category_id === c.id && m.type === "ingreso")),
  }));
  const egresos = cats.filter((c) => c.tipo === "egreso").map((c) => ({
    cat: c,
    totales: sumarPorMoneda(movs.filter((m) => m.category_id === c.id && m.type === "egreso")),
  }));

  return (
    <main>
      {demoBanner()}
      {pageTitle("Dashboard por categoría", "Desglose de ingresos y egresos del negocio — ARS y USD por separado.")}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-600 mb-3">Ingresos por categoría</h2>
          {ingresos.map(({ cat, totales }) => (
            <div key={cat.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
              <div className="text-sm truncate" title={cat.description ?? cat.name}>{cat.name}</div>
              <div className="font-mono text-sm">{formatMontosPorMoneda(totales)}</div>
            </div>
          ))}
          {ingresos.length === 0 && <div className="text-xs italic text-slate-400">Sin categorías de ingreso.</div>}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-600 mb-3">Egresos por categoría</h2>
          {egresos.map(({ cat, totales }) => (
            <div key={cat.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
              <div className="text-sm truncate" title={cat.description ?? cat.name}>{cat.name}</div>
              <div className="font-mono text-sm">{formatMontosPorMoneda(totales)}</div>
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
