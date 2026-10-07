import { demoBanner, pageTitle } from "@/lib/ui/components";
import NuevoClienteForm from "@/app/clientes/nuevo/nuevo-cliente-form";

export const dynamic = "force-dynamic";

export default async function NuevoClientePage() {
  return (
    <main>
      {demoBanner()}
      {pageTitle("Cargar cliente", "Datos básicos del comprador.")}
      <div className="rounded-xl border border-slate-200 bg-white p-5 max-w-xl">
        <NuevoClienteForm />
      </div>
    </main>
  );
}
