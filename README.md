# Castello · Gestión — Fase 1

Sistema de gestión centralizado para **Castello** (concesionaria de autos):
stock de vehículos, clientes, operaciones de venta, seguimiento de pagos/cobros
e indicadores clave. Multi-moneda (ARS/USD) — confirmado con un boleto de
preventa real (LEMA SRL), que también sumó ficha de cliente completa, costos
adicionales de la operación y vehículo usado como parte de pago (permuta).

Esqueleto de arquitectura reutilizado de otro proyecto del mismo estudio
(Next.js + modo demo), adaptado al rubro de venta de vehículos y pasado a
**MySQL** — no sabemos todavía qué hosting va a usar el cliente, y MySQL es
el denominador común incluso en planes de hosting compartido (a diferencia
de Postgres). Es intencionalmente un punto de partida, no el modelo final:
varios campos y reglas de negocio quedan pendientes de confirmar con el
cliente.

## 1. Requisitos

- Node.js ≥ 20
- MySQL 8 (o MariaDB) para correr con datos reales — opcional: Docker, para
  levantar uno local en un comando (ver §6)

## 2. App (Next.js 16 + TS + Tailwind 4 + Vitest)

```bash
npm install
npm run dev        # desarrollo → http://localhost:3002
npm test           # tests de lógica de negocio (Vitest)
npm run build      # build de producción
npm run typecheck  # verificación de tipos
```

### Pantallas

| Ruta | Descripción |
|---|---|
| `/` | Resumen — indicadores clave (ingresos, egresos, stock, pendientes) |
| `/vehiculos` · `/vehiculos/[id]` | Stock de unidades |
| `/clientes` | Compradores |
| `/operaciones` · `/operaciones/nueva` | Ventas (vehículo + cliente + forma de pago) |
| `/movimientos` · `/movimientos/nuevo` | Ingresos/egresos, carga manual |
| `/cola` | Cola única de movimientos pendientes de categorizar |
| `/dashboards/vehiculo` · `/dashboards/categoria` · `/dashboards/cuenta` | Indicadores clave |
| `/publicaciones` | Estado de publicación por vehículo en Motordill/ML y Catálogo de Meta |
| `/login` · `/logout` | Sin autenticación implementada todavía (ver §5) |

### Modo demo vs producción

Sin base de datos configurada, la app corre en **modo demo de solo lectura**
con datos **ficticios** (`lib/data/mock.ts`, marcados como tales). Al definir
en `.env.local`:

```
DATABASE_URL=mysql://usuario:password@host:3306/castello
```

(o las variables sueltas `MYSQL_HOST/PORT/USER/PASSWORD/DATABASE`, ver
`.env.example`) se usa MySQL real. Para crear las tablas: aplicar
`db/schema.sql` contra esa base (ver §4 y §7).

## 3. Pendiente — NO inventar

- **Datos reales del negocio**: Mariano va a proponer su propia planilla/Excel.
  No se migra ni se asume ninguna columna hasta recibirla — el modelo de datos
  de `db/schema.sql` es un punto de partida a ajustar, no el definitivo.
- **Reglas de negocio** (comisión por venta, financiación, etc.): quedan en
  `config` sin valores — se completan cuando el cliente los confirme.
- **Integración de publicaciones**: Mariano ya definió las plataformas (ML,
  Motordill, Catálogo de WhatsApp, Instagram, Facebook), así que el
  scaffolding ya está armado en `lib/integrations/` — activarla es llenar
  credenciales + reemplazar una función, no empezar de cero:
  1. **Motordill** (cubre también ML, que Motordill ya alimenta solo):
     completar `MOTORDILL_API_KEY` y `MOTORDILL_INTEGRATION_METHOD` en
     `.env.local`, e implementar la llamada real dentro de `publish()` en
     `lib/integrations/motordill.ts` (reemplazar el `throw new Error(...)`
     final por el fetch real).
  2. **Catálogo de Meta** (cubre WhatsApp Catalog + Instagram + Facebook,
     que comparten un mismo catálogo de Commerce Manager): completar
     `META_ACCESS_TOKEN`, `META_CATALOG_ID`, `META_BUSINESS_ID` e
     implementar `publish()` en `lib/integrations/meta-catalogo.ts`.
  3. El resto (pantalla `/publicaciones`, validación, guardado del estado
     por canal en la tabla `publicaciones`) ya funciona sin tocarlo.

## 4. Schema MySQL (`db/schema.sql`)

Tablas: `vehiculos` (con `version`, estado `a_ingresar` y `direccion`),
`clientes`, `categorias`, `cuentas`, `operaciones`, `movimientos`,
`publicaciones` (estado de publicación por vehículo y canal),
`vehiculo_fotos` (fotos por vehículo, ver §8), `config`. Los campos antes
restringidos con `check` en Postgres pasan a `ENUM(...)` nativo de MySQL
(funciona igual en MySQL 5.7+ y en MariaDB, sin depender de `CHECK`, que
recién se soporta desde MySQL 8.0.16 y no está garantizado en hosting
compartido barato).

No hay Row Level Security (no existe en MySQL) ni tablas `roles`/`user_roles`
— dependen de un sistema de auth que todavía no existe (ver §5), no se
inventan ahora.

## 5. Autenticación — todavía no implementada

- `proxy.ts` no protege ninguna ruta y `app/login`/`app/logout` son stubs a
  propósito — decisión explícita para no construir un sistema de login
  "de una sola vez" junto con el cambio de base de datos.
- Cuando haya que implementarlo: crear `lib/auth.ts` con una consulta de
  sesión real (cookie propia + tabla de usuarios, ya que no hay Supabase
  Auth), usarlo desde `app/layout.tsx` para mostrar el usuario logueado, y
  volver a activar la protección de rutas en `proxy.ts`.

## 6. Desarrollo local con Docker (opcional)

```bash
docker compose up -d   # MySQL 8 en localhost:3307, aplica db/schema.sql solo
echo "DATABASE_URL=mysql://castello:castello@localhost:3307/castello" >> .env.local
npm run dev
```

(Puerto 3307 en vez del 3306 de siempre, por si ya tenés un MySQL corriendo
en la máquina — cambiá el mapeo en `docker-compose.yml` si no es tu caso.)

Sin Docker, la app sigue funcionando en modo demo sin ningún paso extra.

## 7. Sincronizar con el hosting

Mismo `db/schema.sql` aplicado contra la base de MySQL del hosting (Hostinger
u otro), sin herramientas de migración extra en esta fase:

```bash
mysql -h <host> -u <usuario> -p <base> < db/schema.sql
```

(o importándolo por phpMyAdmin si el panel no da acceso a `mysql` por
consola). Después, apuntar `DATABASE_URL`/`MYSQL_*` de producción a esa
base — mismo schema en local y en el hosting.

## 8. Fotos de vehículos

Se guardan como archivos en `public/uploads/vehiculos/<id>/` (solo el
nombre queda en la tabla `vehiculo_fotos`) — `next start` sirve `public/`
en runtime, no solo en build, así que funciona igual en local y en
cualquier hosting con Node. **Necesita disco persistente**: no sirve en
hosting serverless (tipo Vercel) y, como está en `.gitignore`, no viaja
con git — si se cambia de servidor hay que copiar la carpeta a mano.

Se exige al menos 1 foto para poder "Publicar" un vehículo (ver
`validarVehiculoParaPublicar` en `lib/business/publicaciones.ts`), mismo
mínimo que ya exige MercadoLibre en la práctica.
