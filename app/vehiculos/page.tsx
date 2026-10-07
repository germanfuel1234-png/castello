import Link from "next/link";
import { repo } from "@/lib/data/repository";
import { demoBanner, estadoBadge, pageTitle } from "@/lib/ui/components";
import { formatMoney } from "@/lib/business/money";

export const dynamic = "force-dynamic";

export default async function VehiculosPage() {
  const vehiculos = await repo.getVehiculos();

  return (
    <main>
      {demoBanner()}
      {pageTitle("Vehículos", "Stock de unidades — alta, baja y seguimiento de estado.")}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="table-datos">
          <thead>
            <tr>
              <th>Marca / Modelo</th>
              <th>Año</th>
              <th>Patente</th>
              <th>Km</th>
              <th>Estado</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody>
            {vehiculos.map((v) => (
              <tr key={v.id}>
                <td>
                  <Link href={`/vehiculos/${v.id}`} className="text-[#2563eb] font-semibold hover:underline">
                    {v.marca} {v.modelo}
                  </Link>
                </td>
                <td>{v.anio ?? "—"}</td>
                <td>{v.patente ?? "—"}</td>
                <td>{v.km ?? "—"}</td>
                <td>{estadoBadge(v.estado)}</td>
                <td className="font-mono">{v.precio ? formatMoney(v.precio) : "—"}</td>
              </tr>
            ))}
            {vehiculos.length === 0 && (
              <tr>
                <td colSpan={6} className="italic text-slate-400">Sin vehículos.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-slate-400">
        Alta/edición de registros disponible al conectar credenciales de Supabase (modo demo de solo lectura).
      </p>
    </main>
  );
}
