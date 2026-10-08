import { repo } from "@/lib/data/repository";
import { demoBanner, estadoBadge, nombreCuenta, pageTitle } from "@/lib/ui/components";
import { formatMoney } from "@/lib/business/money";
import { movimientosPendientes, contarPendientes } from "@/lib/business/cola-pendientes";
import { modoDemo } from "@/lib/db/modo";
import CategorizarForm from "@/app/cola/categorizar-form";

export const dynamic = "force-dynamic";

export default async function ColaPendientesPage() {
  const demo = modoDemo();
  const [movs, cuentas, vehiculos, cats] = await Promise.all([
    repo.getMovimientos(),
    repo.getCuentas(),
    repo.getVehiculos(),
    repo.getCategorias(),
  ]);
  const pendientes = movimientosPendientes(movs);

  return (
    <main>
      {demoBanner()}
      {pageTitle(
        "Cola de movimientos pendientes de categorizar",
        "Punto de entrada obligatorio de todo dato automatizado: cuando haya integraciones, entran sin clasificar y un humano asigna vehículo/categoría.",
      )}

      <div className="mb-4 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm">
        <span className="font-semibold">{contarPendientes(pendientes)}</span> movimiento(s) esperando categorización.
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="table-datos">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Descripción</th>
              <th>Cuenta</th>
              <th>Monto</th>
              <th>Origen</th>
              <th className="w-[20rem]">Categorizar</th>
            </tr>
          </thead>
          <tbody>
            {pendientes.map((m) => (
              <tr key={m.id} className="bg-amber-50/40">
                <td className="whitespace-nowrap">{m.fecha.slice(0, 10)}</td>
                <td>{estadoBadge(m.type)}</td>
                <td className="max-w-[12rem] truncate" title={m.description}>{m.description ?? "—"}</td>
                <td>{nombreCuenta(m.cuenta_id, cuentas)}</td>
                <td className="font-mono">{formatMoney(Math.abs(m.amount), m.moneda)}</td>
                <td>
                  <span className="badge badge-slate">{m.source ?? "manual"}</span>
                </td>
                <td>
                  <CategorizarForm movement={m} vehiculos={vehiculos} cats={cats} demo={demo} />
                </td>
              </tr>
            ))}
            {pendientes.length === 0 && (
              <tr>
                <td colSpan={7} className="italic text-slate-400">Cola vacía. 🎉</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
