/**
 * Chequeo de "¿hay base de datos configurada?" sin importar el driver de
 * MySQL (`mysql2` usa módulos nativos de Node — `net`/`tls` — que no se
 * pueden empaquetar para el bundle de cliente). Los Client Components que
 * necesitan saber si están en modo demo reciben el valor como prop desde
 * su página (Server Component); no importan este archivo directamente
 * en el navegador — pero igual conviene que sea liviano por las dudas.
 */
export function dbConfigurado(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim() || process.env.MYSQL_HOST?.trim());
}

export function modoDemo(): boolean {
  return !dbConfigurado();
}
