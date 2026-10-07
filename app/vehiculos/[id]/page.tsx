import { notFound } from "next/navigation";
import { repo } from "@/lib/data/repository";
import { demoBanner, estadoBadge, pageTitle } from "@/lib/ui/components";
import { formatMoney } from "@/lib/business/money";

export const dynamic = "force-dynamic";

export default async function VehiculoDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [vehiculos, movs, cats] = await Promise.all([
    repo.getVehiculos(),
    repo.getMovimientosByVehiculo(Number(id)),
    repo.getCategorias(),
  ]);

  const vehiculo = vehiculos.find((v) => v.id === Number(id));
  if (!vehiculo) notFound();

  const ingresos = movs.filter((m) => m.type === "ingreso").reduce((a, m) => a + m.amount, 0);
  const egresos = movs.filter((m) => m.type === "egreso").reduce((a, m) => a + m.amount, 0);

  return (
    <main>
      {demoBanner()}
      {pageTitle(`${vehiculo.marca} ${vehiculo.modelo}`, `${vehiculo.patente ?? "sin patente"} · ${vehiculo.anio ?? "?"}`)}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-[0.7rem] uppercase text-slate-400">Estado</div>
          <div className="text-2xl font-bold">{estadoBadge(vehiculo.estado)}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-[0.7rem] uppercase text-slate-400">Ingresos asociados</div>
          <div className="text-2xl font-bold text-[#0f766e]">{formatMoney(ingresos)}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-[0.7rem] uppercase text-slate-400">Egresos asociados</div>
          <div className="text-2xl font-bold text-[#b91c1c]">{formatMoney(egresos)}</div>
        </div>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-slate-600 mb-3">Movimientos</h2>
        <table className="table-datos">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Descripción</th>
              <th>Categoría</th>
              <th>Monto</th>
            </tr>
          </thead>
          <tbody>
            {movs.map((m) => (
              <tr key={m.id}>
                <td className="whitespace-nowrap">{m.fecha.slice(0, 10)}</td>
                <td className="max-w-[12rem] truncate" title={m.description}>{m.description ?? "—"}</td>
                <td>{cats.find((c) => c.id === m.category_id)?.name ?? "—"}</td>
                <td className="font-mono">{formatMoney(Math.abs(m.amount))}</td>
              </tr>
            ))}
            {movs.length === 0 && (
              <tr>
                <td colSpan={4} className="italic text-slate-400">Sin movimientos.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
