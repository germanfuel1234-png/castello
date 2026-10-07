import { repo } from "@/lib/data/repository";
import { demoBanner, estadoBadge, nombreCategoria, nombreCuenta, nombreVehiculo, pageTitle } from "@/lib/ui/components";
import { formatMoney } from "@/lib/business/money";

export const dynamic = "force-dynamic";

export default async function MovimientosPage() {
  const [movs, vehiculos, cats, cuentas] = await Promise.all([
    repo.getMovimientos(),
    repo.getVehiculos(),
    repo.getCategorias(),
    repo.getCuentas(),
  ]);

  return (
    <main>
      {demoBanner()}
      {pageTitle("Movimientos", "Ingresos y egresos del negocio, en ARS.")}

      <div className="mb-4 flex items-center gap-2 text-sm">
        <a
          href="/movimientos/nuevo"
          className="rounded-lg bg-[#2563eb] px-3 py-1.5 font-semibold text-white hover:bg-[#1d4ed8]"
        >
          + Cargar movimiento manual
        </a>
        <a href="/cola" className="text-[#0f766e] underline text-xs">ir a la cola de pendientes →</a>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="table-datos">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Descripción</th>
              <th>Vehículo</th>
              <th>Categoría</th>
              <th>Cuenta</th>
              <th>Monto</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {movs.map((m) => (
              <tr key={m.id}>
                <td className="whitespace-nowrap">{m.fecha.slice(0, 10)}</td>
                <td>{estadoBadge(m.type)}</td>
                <td className="max-w-[14rem] truncate" title={m.description}>{m.description ?? m.source ?? "—"}</td>
                <td>{nombreVehiculo(m.vehiculo_id, vehiculos)}</td>
                <td>{nombreCategoria(m.category_id, cats)}</td>
                <td>{nombreCuenta(m.cuenta_id, cuentas)}</td>
                <td className="font-mono">{formatMoney(Math.abs(m.amount))}</td>
                <td>{estadoBadge(m.estado_categorizacion)}</td>
              </tr>
            ))}
            {movs.length === 0 && (
              <tr>
                <td colSpan={8} className="italic text-slate-400">Sin movimientos.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
