import { repo } from "@/lib/data/repository";
import { demoBanner, estadoBadge, nombreVehiculo, pageTitle } from "@/lib/ui/components";
import { formatMoney } from "@/lib/business/money";

export const dynamic = "force-dynamic";

export default async function OperacionesPage() {
  const [operaciones, vehiculos, clientes] = await Promise.all([
    repo.getOperaciones(),
    repo.getVehiculos(),
    repo.getClientes(),
  ]);

  return (
    <main>
      {demoBanner()}
      {pageTitle("Operaciones", "Ventas de unidades — vehículo, cliente, forma de pago y estado.")}

      <div className="mb-4">
        <a
          href="/operaciones/nueva"
          className="rounded-lg bg-[#2563eb] px-3 py-1.5 text-sm font-semibold text-white hover:bg-[#1d4ed8]"
        >
          + Cargar operación
        </a>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="table-datos">
          <thead>
            <tr>
              <th>PV N°</th>
              <th>Fecha</th>
              <th>Vehículo</th>
              <th>Cliente</th>
              <th>Vendedor</th>
              <th>Precio</th>
              <th>Forma de pago</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {operaciones.map((o) => (
              <tr key={o.id}>
                <td>{o.pv_numero ?? "—"}</td>
                <td className="whitespace-nowrap">{o.fecha.slice(0, 10)}</td>
                <td>{nombreVehiculo(o.vehiculo_id, vehiculos)}</td>
                <td>{clientes.find((c) => c.id === o.cliente_id)?.name ?? "—"}</td>
                <td>{o.vendedor ?? "—"}</td>
                <td className="font-mono">{formatMoney(o.precio_venta, o.moneda)}</td>
                <td>{estadoBadge(o.forma_pago)}</td>
                <td>{estadoBadge(o.estado)}</td>
              </tr>
            ))}
            {operaciones.length === 0 && (
              <tr>
                <td colSpan={8} className="italic text-slate-400">Sin operaciones.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
