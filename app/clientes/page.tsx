import { repo } from "@/lib/data/repository";
import { demoBanner, pageTitle } from "@/lib/ui/components";

export const dynamic = "force-dynamic";

export default async function ClientesPage() {
  const clientes = await repo.getClientes();

  return (
    <main>
      {demoBanner()}
      {pageTitle("Clientes", "Compradores registrados.")}

      <div className="mb-4">
        <a
          href="/clientes/nuevo"
          className="rounded-lg bg-[#2563eb] px-3 py-1.5 text-sm font-semibold text-white hover:bg-[#1d4ed8]"
        >
          + Cargar cliente
        </a>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="table-datos">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>DNI</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Dirección</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.dni ?? "—"}</td>
                <td>{c.email ?? "—"}</td>
                <td>{c.phone ?? "—"}</td>
                <td>{c.address ?? "—"}</td>
              </tr>
            ))}
            {clientes.length === 0 && (
              <tr>
                <td colSpan={5} className="italic text-slate-400">Sin clientes.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-slate-400">
        En modo demo el alta queda validada pero no se persiste (falta conectar Supabase).
      </p>
    </main>
  );
}
