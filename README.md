# Castello · Gestión — Fase 1

Sistema de gestión centralizado para **Castello** (concesionaria de autos):
stock de vehículos, clientes, operaciones de venta, seguimiento de pagos/cobros
e indicadores clave. Una sola moneda (ARS).

Esqueleto de arquitectura reutilizado de otro proyecto del mismo estudio
(Next.js + Supabase + modo demo), adaptado al rubro de venta de vehículos.
Es intencionalmente un punto de partida, no el modelo final: varios campos y
reglas de negocio quedan pendientes de confirmar con el cliente.

## 1. Requisitos

- Node.js ≥ 20
- Supabase CLI (solo para `supabase db push`)

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
| `/login` · `/logout` | Autenticación Supabase |

### Modo demo vs producción

Sin credenciales, la app corre en **modo demo de solo lectura** con datos
**ficticios** (`lib/data/mock.ts`, marcados como tales). Al definir en `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

…se usa Supabase real (ver `.env.example`). Para poblar la BD: `supabase db push`.

## 3. Pendiente — NO inventar

- **Datos reales del negocio**: Mariano va a proponer su propia planilla/Excel.
  No se migra ni se asume ninguna columna hasta recibirla — el modelo de datos
  de `supabase/schema.sql` es un punto de partida a ajustar, no el definitivo.
- **Reglas de negocio** (comisión por venta, financiación, etc.): quedan en
  `config` sin valores — se completan cuando el cliente los confirme.
- **Integración de publicaciones**: fuera de alcance de este repo por ahora.
  Se evalúa en una fase posterior, cuando se sepa qué portal usa.

## 4. Schema Supabase (`supabase/schema.sql`)

Tablas: `vehiculos`, `clientes`, `categorias`, `cuentas`, `operaciones`,
`movimientos`, `config`. Incluye Row Level Security (autenticados CRUD,
`config` solo admins, anónimos denegado).

## 5. Autenticación

- `app/login` + `/logout` + `proxy.ts` (protección de rutas, solo cuando hay Supabase).
- En **modo demo** no hay sesión (no existe proyecto Supabase todavía).
