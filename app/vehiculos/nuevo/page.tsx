import { demoBanner, pageTitle } from "@/lib/ui/components";
import { modoDemo } from "@/lib/db/modo";
import NuevoVehiculoForm from "@/app/vehiculos/nuevo/nuevo-vehiculo-form";

export const dynamic = "force-dynamic";

export default async function NuevoVehiculoPage() {
  return (
    <main>
      {demoBanner()}
      {pageTitle("Cargar vehículo", "Datos básicos de la unidad para sumarla al stock.")}
      <div className="rounded-xl border border-slate-200 bg-white p-5 max-w-2xl">
        <NuevoVehiculoForm demo={modoDemo()} />
      </div>
    </main>
  );
}
