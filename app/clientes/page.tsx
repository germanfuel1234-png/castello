import { repo } from "@/lib/data/repository";
import { demoBanner, pageTitle } from "@/lib/ui/components";
import { modoDemo } from "@/lib/db/modo";

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
              <th>Estado civil</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c) => {
              const direccion = [c.calle && c.numero ? `${c.calle} ${c.numero}` : c.calle, c.localidad].filter(Boolean).join(", ");
              return (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.dni ?? "—"}</td>
                  <td>{c.email ?? "—"}</td>
                  <td>{c.phone ?? "—"}</td>
                  <td>{direccion || "—"}</td>
                  <td className="capitalize">{c.estado_civil?.replace("_", " ") ?? "—"}</td>
                </tr>
              );
            })}
            {clientes.length === 0 && (
              <tr>
                <td colSpan={6} className="italic text-slate-400">Sin clientes.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {modoDemo() && (
        <p className="mt-4 text-xs text-slate-400">
          En modo demo el alta queda validada pero no se persiste (falta conectar la base de datos).
        </p>
      )}
    </main>
  );
}
