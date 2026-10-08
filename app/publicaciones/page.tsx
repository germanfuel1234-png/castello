import { repo } from "@/lib/data/repository";
import { demoBanner, estadoBadge, pageTitle } from "@/lib/ui/components";
import { estadoEnCanal, fotosDeVehiculo, NOMBRE_CANAL, validarVehiculoParaPublicar } from "@/lib/business/publicaciones";
import PublicarForm from "@/app/publicaciones/publicar-form";

export const dynamic = "force-dynamic";

export default async function PublicacionesPage() {
  const [vehiculos, publicaciones, fotos] = await Promise.all([
    repo.getVehiculos(),
    repo.getPublicaciones(),
    repo.getFotos(),
  ]);

  return (
    <main>
      {demoBanner()}
      {pageTitle(
        "Publicaciones",
        "Estado de cada vehículo en Motordill/ML y en el Catálogo de Meta (WhatsApp, Instagram y Facebook).",
      )}

      <div className="mb-4 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
        Motordill ya empuja automáticamente a MercadoLibre, por eso comparten una sola columna. Lo mismo pasa con
        WhatsApp Catalog, Instagram y Facebook: las tres se alimentan del mismo Catálogo de Meta. Mientras no haya
        credenciales reales (ver <code>.env.example</code>), publicar va a mostrar qué variable falta.
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="table-datos">
          <thead>
            <tr>
              <th>Vehículo</th>
              <th>Estado stock</th>
              <th>{NOMBRE_CANAL.motordill}</th>
              <th>{NOMBRE_CANAL.meta_catalogo}</th>
            </tr>
          </thead>
          <tbody>
            {vehiculos.map((v) => {
              const cantidadFotos = fotosDeVehiculo(fotos, v.id).length;
              const errores = validarVehiculoParaPublicar(v, cantidadFotos);
              const disabled = errores.length > 0;
              return (
                <tr key={v.id}>
                  <td>
                    <div className="font-semibold">
                      {v.marca} {v.modelo}
                    </div>
                    {v.version && <div className="text-xs text-slate-400">{v.version}</div>}
                    <div className={`text-xs ${cantidadFotos === 0 ? "text-amber-600" : "text-slate-400"}`}>
                      {cantidadFotos === 0 ? "⚠ sin fotos" : `📷 ${cantidadFotos} foto${cantidadFotos === 1 ? "" : "s"}`}
                    </div>
                  </td>
                  <td>{estadoBadge(v.estado)}</td>
                  <td>
                    <PublicarForm
                      vehiculoId={v.id}
                      canal="motordill"
                      publicacion={estadoEnCanal(publicaciones, v.id, "motordill")}
                      disabled={disabled}
                    />
                  </td>
                  <td>
                    <PublicarForm
                      vehiculoId={v.id}
                      canal="meta_catalogo"
                      publicacion={estadoEnCanal(publicaciones, v.id, "meta_catalogo")}
                      disabled={disabled}
                    />
                  </td>
                </tr>
              );
            })}
            {vehiculos.length === 0 && (
              <tr>
                <td colSpan={4} className="italic text-slate-400">
                  Sin vehículos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
