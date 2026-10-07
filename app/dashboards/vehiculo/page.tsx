import { repo } from "@/lib/data/repository";
import { demoBanner, estadoBadge, pageTitle } from "@/lib/ui/components";
import { formatMoney } from "@/lib/business/money";

export const dynamic = "force-dynamic";

export default async function DashboardVehiculoPage() {
  const [vehiculos, movs] = await Promise.all([repo.getVehiculos(), repo.getMovimientos()]);

  return (
    <main>
      {demoBanner()}
      {pageTitle("Dashboard por vehículo", "Ingresos y egresos asociados a cada unidad.")}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="table-datos">
          <thead>
            <tr>
              <th>Vehículo</th>
              <th>Estado</th>
              <th>Ingresos</th>
              <th>Egresos</th>
              <th>Neto</th>
            </tr>
          </thead>
          <tbody>
            {vehiculos.map((v) => {
              const deVehiculo = movs.filter((m) => m.vehiculo_id === v.id);
              const ingresos = deVehiculo.filter((m) => m.type === "ingreso").reduce((a, m) => a + m.amount, 0);
              const egresos = deVehiculo.filter((m) => m.type === "egreso").reduce((a, m) => a + m.amount, 0);
              return (
                <tr key={v.id}>
                  <td>{v.marca} {v.modelo} {v.anio ?? ""}</td>
                  <td>{estadoBadge(v.estado)}</td>
                  <td className="font-mono text-[#0f766e]">{formatMoney(ingresos)}</td>
                  <td className="font-mono text-[#b91c1c]">{formatMoney(egresos)}</td>
                  <td className="font-mono font-semibold">{formatMoney(ingresos - egresos)}</td>
                </tr>
              );
            })}
            {vehiculos.length === 0 && (
              <tr>
                <td colSpan={5} className="italic text-slate-400">Sin vehículos.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
