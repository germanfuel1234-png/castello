import { notFound } from "next/navigation";
import { repo } from "@/lib/data/repository";
import { demoBanner, estadoBadge, pageTitle } from "@/lib/ui/components";
import { formatMoney, formatMontosPorMoneda, sumarPorMoneda } from "@/lib/business/money";
import { modoDemo } from "@/lib/db/modo";
import { fotoUrl } from "@/lib/storage/fotos";
import FotosForm from "@/app/vehiculos/[id]/fotos-form";
import EliminarFotoForm from "@/app/vehiculos/[id]/eliminar-foto-form";

export const dynamic = "force-dynamic";

export default async function VehiculoDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const demo = modoDemo();
  const [vehiculos, movs, cats, fotos] = await Promise.all([
    repo.getVehiculos(),
    repo.getMovimientosByVehiculo(Number(id)),
    repo.getCategorias(),
    repo.getFotosByVehiculo(Number(id)),
  ]);

  const vehiculo = vehiculos.find((v) => v.id === Number(id));
  if (!vehiculo) notFound();

  const ingresos = sumarPorMoneda(movs.filter((m) => m.type === "ingreso"));
  const egresos = sumarPorMoneda(movs.filter((m) => m.type === "egreso"));

  return (
    <main>
      {demoBanner()}
      {pageTitle(
        `${vehiculo.marca} ${vehiculo.modelo}${vehiculo.version ? ` ${vehiculo.version}` : ""}`,
        `${vehiculo.patente ?? "sin patente"} · ${vehiculo.anio ?? "?"}`,
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-[0.7rem] uppercase text-slate-400">Estado</div>
          <div className="text-2xl font-bold">{estadoBadge(vehiculo.estado)}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-[0.7rem] uppercase text-slate-400">Ingresos asociados</div>
          <div className="text-2xl font-bold text-[#0f766e]">{formatMontosPorMoneda(ingresos)}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-[0.7rem] uppercase text-slate-400">Egresos asociados</div>
          <div className="text-2xl font-bold text-[#b91c1c]">{formatMontosPorMoneda(egresos)}</div>
        </div>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-4 mb-6">
        <h2 className="text-sm font-semibold text-slate-600 mb-3">Ficha técnica</h2>
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <dt className="text-[0.7rem] uppercase text-slate-400">Color</dt>
            <dd>{vehiculo.color ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-[0.7rem] uppercase text-slate-400">Combustible</dt>
            <dd className="capitalize">{vehiculo.combustible ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-[0.7rem] uppercase text-slate-400">Transmisión</dt>
            <dd className="capitalize">{vehiculo.transmision ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-[0.7rem] uppercase text-slate-400">Carrocería</dt>
            <dd className="capitalize">{vehiculo.tipo_carroceria ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-[0.7rem] uppercase text-slate-400">Puertas</dt>
            <dd>{vehiculo.puertas ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-[0.7rem] uppercase text-slate-400">Motor</dt>
            <dd>{vehiculo.motor ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-[0.7rem] uppercase text-slate-400">Dirección</dt>
            <dd className="capitalize">{vehiculo.direccion ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-[0.7rem] uppercase text-slate-400">Cargado por</dt>
            <dd className="capitalize">{vehiculo.cargado_por ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-[0.7rem] uppercase text-slate-400">Acepta permuta</dt>
            <dd>{vehiculo.acepta_permuta ? "Sí" : "No"}</dd>
          </div>
          <div>
            <dt className="text-[0.7rem] uppercase text-slate-400">Precio negociable</dt>
            <dd>{vehiculo.precio_negociable ? "Sí" : "No"}</dd>
          </div>
        </dl>
        {vehiculo.descripcion && (
          <p className="mt-4 text-sm text-slate-600 whitespace-pre-line border-t border-slate-100 pt-3">
            {vehiculo.descripcion}
          </p>
        )}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 mb-6">
        <h2 className="text-sm font-semibold text-slate-600 mb-1">Fotos</h2>
        <p className="text-xs text-slate-400 mb-3">
          Se necesita al menos 1 foto para poder publicar este vehículo en Motordill/ML o en el Catálogo de Meta.
        </p>
        {fotos.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-4">
            {fotos.map((f) => (
              <div key={f.id} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={fotoUrl(vehiculo.id, f.archivo)}
                  alt={`${vehiculo.marca} ${vehiculo.modelo}`}
                  className="h-24 w-24 rounded-md object-cover border border-slate-200"
                />
                <EliminarFotoForm vehiculoId={vehiculo.id} fotoId={f.id} archivo={f.archivo} demo={demo} />
              </div>
            ))}
          </div>
        )}
        {fotos.length === 0 && <p className="text-sm italic text-slate-400 mb-4">Sin fotos todavía.</p>}
        <FotosForm vehiculoId={vehiculo.id} demo={demo} />
      </section>

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
                <td className="font-mono">{formatMoney(Math.abs(m.amount), m.moneda)}</td>
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
