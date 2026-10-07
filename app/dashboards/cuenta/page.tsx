import { repo } from "@/lib/data/repository";
import { demoBanner, pageTitle } from "@/lib/ui/components";
import { formatMoney } from "@/lib/business/money";

export const dynamic = "force-dynamic";

export default async function DashboardCuentaPage() {
  const [cuentas, movs] = await Promise.all([repo.getCuentas(), repo.getMovimientos()]);

  return (
    <main>
      {demoBanner()}
      {pageTitle("Dashboard por cuenta", "Ingresos, egresos y saldo por cuenta/medio de pago.")}

      {cuentas.map((c) => {
        const deCuenta = movs.filter((m) => m.cuenta_id === c.id);
        const ingresos = deCuenta.filter((m) => m.type === "ingreso").reduce((a, m) => a + m.amount, 0);
        const egresos = deCuenta.filter((m) => m.type === "egreso").reduce((a, m) => a + m.amount, 0);
        return (
          <section key={c.id} className="mb-4 rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-baseline justify-between">
              <div>
                <h2 className="font-semibold">{c.name}</h2>
                <div className="text-xs text-slate-400">{c.tipo}</div>
              </div>
              <div className="text-sm text-slate-500">{deCuenta.length} movimientos</div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3">
              <div>
                <div className="text-[0.7rem] uppercase text-slate-400">Ingresos</div>
                <div className="font-mono text-lg text-[#0f766e]">{formatMoney(ingresos)}</div>
              </div>
              <div>
                <div className="text-[0.7rem] uppercase text-slate-400">Egresos</div>
                <div className="font-mono text-lg text-[#b91c1c]">{formatMoney(egresos)}</div>
              </div>
              <div>
                <div className="text-[0.7rem] uppercase text-slate-400">Saldo neto</div>
                <div className="font-mono text-lg font-bold">{formatMoney(ingresos - egresos)}</div>
              </div>
            </div>
          </section>
        );
      })}

      {cuentas.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-400 italic">
          Sin cuentas cargadas.
        </div>
      )}
    </main>
  );
}
