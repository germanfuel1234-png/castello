import { repo } from "@/lib/data/repository";
import { demoBanner, estadoBadge, montoMovimiento, nombreVehiculo, pageTitle, statCard } from "@/lib/ui/components";
import { formatMoney, formatMontosPorMoneda, sumarPorMoneda } from "@/lib/business/money";
import { contarPendientes } from "@/lib/business/cola-pendientes";

export const dynamic = "force-dynamic";

export default async function ResumenPage() {
  const [vehiculos, clientes, operaciones, movs] = await Promise.all([
    repo.getVehiculos(),
    repo.getClientes(),
    repo.getOperaciones(),
    repo.getMovimientos(),
  ]);

  const totalIngresos = sumarPorMoneda(movs.filter((m) => m.type === "ingreso"));
  const totalEgresos = sumarPorMoneda(movs.filter((m) => m.type === "egreso"));
  const pendientes = contarPendientes(movs);
  const disponibles = vehiculos.filter((v) => v.estado === "disponible").length;
  const reservados = vehiculos.filter((v) => v.estado === "reservado").length;
  const vendidos = vehiculos.filter((v) => v.estado === "vendido").length;
  const saldoNeto = { ars: (totalIngresos.ars ?? 0) - (totalEgresos.ars ?? 0), usd: (totalIngresos.usd ?? 0) - (totalEgresos.usd ?? 0) };

  return (
    <main className="px-6 py-6">
      {demoBanner()}
      {pageTitle("Resumen", "Vista general del negocio — montos en ARS y USD por separado (no se mezclan).")}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statCard("Ingresos", formatMontosPorMoneda(totalIngresos), `${movs.filter((m) => m.type === "ingreso").length} movimientos`, "text-[#0f766e]")}
        {statCard("Egresos", formatMontosPorMoneda(totalEgresos), "gastos y comisiones", "text-[#b91c1c]")}
        {statCard("Saldo neto", formatMontosPorMoneda(saldoNeto), "ingresos − egresos", "text-[#17202b]")}
        {statCard("Pendientes de categorizar", String(pendientes), "cola única", pendientes > 0 ? "text-[#b45309]" : "text-[#17202b]")}
        {statCard("Stock de vehículos", String(vehiculos.length), `${disponibles} disponibles · ${reservados} reservados · ${vendidos} vendidos`)}
        {statCard("Clientes", String(clientes.length))}
        {statCard("Operaciones", String(operaciones.length))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-600 mb-3">Movimientos recientes</h2>
          <table className="table-datos">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Descripción</th>
                <th>Vehículo</th>
                <th>Monto</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {movs.slice(0, 10).map((m) => (
                <tr key={m.id}>
                  <td className="whitespace-nowrap">{m.fecha.slice(0, 10)}</td>
                  <td className="max-w-[14rem] truncate" title={m.description}>{m.description ?? m.source ?? "—"}</td>
                  <td>{nombreVehiculo(m.vehiculo_id, vehiculos)}</td>
                  <td>{montoMovimiento(m)}</td>
                  <td>{estadoBadge(m.estado_categorizacion)}</td>
                </tr>
              ))}
              {movs.length === 0 && (
                <tr>
                  <td colSpan={5} className="italic text-slate-400">Sin movimientos cargados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-600 mb-3">Stock de vehículos</h2>
          {vehiculos.map((v) => (
            <div key={v.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
              <div>
                <div className="text-sm font-medium">{v.marca} {v.modelo} {v.anio ?? ""}</div>
                <div className="text-xs text-slate-400">{v.patente ?? "sin patente"} · {v.km ?? "?"} km</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold">{v.precio ? formatMoney(v.precio, v.moneda ?? "ars") : "—"}</div>
                <div className="text-xs">{estadoBadge(v.estado)}</div>
              </div>
            </div>
          ))}
          {vehiculos.length === 0 && <div className="text-xs italic text-slate-400">Sin vehículos cargados.</div>}
        </section>
      </div>
    </main>
  );
}
