import { repo } from "@/lib/data/repository";
import { demoBanner, estadoBadge, pageTitle } from "@/lib/ui/components";
import { formatMontosPorMoneda, sumarPorMoneda } from "@/lib/business/money";

export const dynamic = "force-dynamic";

export default async function DashboardVehiculoPage() {
  const [vehiculos, movs] = await Promise.all([repo.getVehiculos(), repo.getMovimientos()]);

  return (
    <main>
      {demoBanner()}
      {pageTitle("Dashboard por vehículo", "Ingresos y egresos asociados a cada unidad — ARS y USD por separado.")}

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
              const ingresos = sumarPorMoneda(deVehiculo.filter((m) => m.type === "ingreso"));
              const egresos = sumarPorMoneda(deVehiculo.filter((m) => m.type === "egreso"));
              const neto = { ars: (ingresos.ars ?? 0) - (egresos.ars ?? 0), usd: (ingresos.usd ?? 0) - (egresos.usd ?? 0) };
              return (
                <tr key={v.id}>
                  <td>{v.marca} {v.modelo} {v.anio ?? ""}</td>
                  <td>{estadoBadge(v.estado)}</td>
                  <td className="font-mono text-[#0f766e]">{formatMontosPorMoneda(ingresos)}</td>
                  <td className="font-mono text-[#b91c1c]">{formatMontosPorMoneda(egresos)}</td>
                  <td className="font-mono font-semibold">{formatMontosPorMoneda(neto)}</td>
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
