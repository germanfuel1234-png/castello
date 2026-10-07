import { repo } from "@/lib/data/repository";
import { demoBanner, pageTitle } from "@/lib/ui/components";
import NuevoMovimientoForm from "@/app/movimientos/nuevo/nuevo-movimiento-form";

export const dynamic = "force-dynamic";

export default async function NuevoMovimientoPage() {
  const [vehiculos, cats, cuentas] = await Promise.all([
    repo.getVehiculos(),
    repo.getCategorias(),
    repo.getCuentas(),
  ]);

  return (
    <main>
      {demoBanner()}
      {pageTitle("Cargar movimiento manual", "Formulario simple para registrar un ingreso o egreso.")}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <NuevoMovimientoForm vehiculos={vehiculos} cats={cats} cuentas={cuentas} />
      </div>
    </main>
  );
}
