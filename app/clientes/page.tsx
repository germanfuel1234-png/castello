import { repo } from "@/lib/data/repository";
import { demoBanner, pageTitle } from "@/lib/ui/components";

export const dynamic = "force-dynamic";

export default async function ClientesPage() {
  const clientes = await repo.getClientes();

  return (
    <main>
      {demoBanner()}
      {pageTitle("Clientes", "Compradores registrados.")}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="table-datos">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.email ?? "—"}</td>
                <td>{c.phone ?? "—"}</td>
              </tr>
            ))}
            {clientes.length === 0 && (
              <tr>
                <td colSpan={3} className="italic text-slate-400">Sin clientes.</td>
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
