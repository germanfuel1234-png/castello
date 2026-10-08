import mysql from "mysql2/promise";
import { dbConfigurado } from "@/lib/db/modo";

/**
 * Pool MySQL. Server-only (repository.ts, server actions) — nunca
 * importar este archivo desde un Client Component, `mysql2` usa módulos
 * nativos de Node (`net`/`tls`) que rompen el build del browser. Para
 * chequear modo demo desde un Client Component, usar `lib/db/modo.ts`
 * (vía prop desde la página, no import directo).
 * - Sin DATABASE_URL (ni MYSQL_HOST) la app corre en MODO DEMO con datos
 *   ficticios (`lib/data/mock.ts`).
 * - Al definir las variables se usa MySQL real (ver `.env.example`).
 * `dateStrings: true` para que columnas datetime vuelvan como string ISO
 * (así coincide con los tipos de `lib/types/database.ts`). `typeCast`
 * convierte TINYINT(1) a boolean de JS (acepta_permuta, precio_negociable).
 */

export { dbConfigurado, modoDemo } from "@/lib/db/modo";

let _pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool | null {
  if (!dbConfigurado()) return null;
  if (!_pool) {
    const opciones: mysql.PoolOptions = {
      dateStrings: true,
      typeCast: (field, next) => {
        if (field.type === "TINY" && field.length === 1) {
          const valor = field.string();
          return valor === null ? null : valor === "1";
        }
        return next();
      },
    };
    _pool = process.env.DATABASE_URL?.trim()
      ? mysql.createPool({ uri: process.env.DATABASE_URL.trim(), ...opciones })
      : mysql.createPool({
          host: process.env.MYSQL_HOST,
          port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306,
          user: process.env.MYSQL_USER,
          password: process.env.MYSQL_PASSWORD,
          database: process.env.MYSQL_DATABASE,
          ...opciones,
        });
  }
  return _pool;
}
