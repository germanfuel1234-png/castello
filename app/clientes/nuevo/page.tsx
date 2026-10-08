import { demoBanner, pageTitle } from "@/lib/ui/components";
import { modoDemo } from "@/lib/db/modo";
import NuevoClienteForm from "@/app/clientes/nuevo/nuevo-cliente-form";

export const dynamic = "force-dynamic";

export default async function NuevoClientePage() {
  return (
    <main>
      {demoBanner()}
      {pageTitle("Cargar cliente", "Ficha completa del comprador (datos típicos del boleto de preventa).")}
      <div className="rounded-xl border border-slate-200 bg-white p-5 max-w-2xl">
        <NuevoClienteForm demo={modoDemo()} />
      </div>
    </main>
  );
}
