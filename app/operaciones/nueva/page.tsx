import { repo } from "@/lib/data/repository";
import { demoBanner, pageTitle } from "@/lib/ui/components";
import NuevaOperacionForm from "@/app/operaciones/nueva/nueva-operacion-form";

export const dynamic = "force-dynamic";

export default async function NuevaOperacionPage() {
  const [vehiculos, clientes] = await Promise.all([repo.getVehiculos(), repo.getClientes()]);

  return (
    <main>
      {demoBanner()}
      {pageTitle("Cargar operación", "Registra la venta de una unidad a un cliente.")}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <NuevaOperacionForm vehiculos={vehiculos.filter((v) => v.estado !== "vendido")} clientes={clientes} />
      </div>
    </main>
  );
}
