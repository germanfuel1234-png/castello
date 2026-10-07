-- Supabase schema for Castello · Gestión (Fase 1)
-- Esqueleto inicial — una sola moneda (ARS), sin fianzas/contratos de alquiler.
-- Se ajusta cuando Mariano confirme su planilla/Excel y reglas de negocio reales.

-- 1. Roles (seguridad)
create table if not exists roles (
  id serial primary key,
  name text unique not null,
  description text
);

create table if not exists user_roles (
  user_id uuid references auth.users(id) on delete cascade,
  role_id int references roles(id) on delete cascade,
  primary key (user_id, role_id)
);

-- 2. Vehículos (unidades)
create table if not exists vehiculos (
  id serial primary key,
  marca text not null,
  modelo text not null,
  anio int,
  patente text,
  km int,
  color text,
  combustible text check (combustible in ('nafta','diesel','gnc','electrico','hibrido')),
  transmision text check (transmision in ('manual','automatica')),
  estado text check (estado in ('disponible','reservado','vendido')) default 'disponible',
  precio numeric(12,2),
  created_at timestamp with time zone default now()
);

-- 3. Clientes
create table if not exists clientes (
  id serial primary key,
  name text not null,
  dni text,
  email text,
  phone text,
  address text,
  created_at timestamp with time zone default now()
);

-- 4. Categorías de ingreso/egreso
create table if not exists categorias (
  id serial primary key,
  name text unique not null,
  tipo text check (tipo in ('ingreso','egreso')) not null,
  description text
);

-- 5. Cuentas / medios de pago (todo en ARS)
create table if not exists cuentas (
  id serial primary key,
  name text not null,
  tipo text check (tipo in ('banco','efectivo','billetera_virtual')) default 'efectivo',
  created_at timestamp with time zone default now()
);

-- 6. Operaciones (ventas)
create table if not exists operaciones (
  id serial primary key,
  vehiculo_id int references vehiculos(id) on delete set null,
  cliente_id int references clientes(id) on delete set null,
  fecha date not null,
  precio_venta numeric(12,2) not null,
  forma_pago text check (forma_pago in ('contado','financiado')) default 'contado',
  estado text check (estado in ('pendiente','confirmada','entregada')) default 'pendiente',
  created_at timestamp with time zone default now()
);

-- 7. Movimientos (ingresos/egresos)
create table if not exists movimientos (
  id serial primary key,
  vehiculo_id int references vehiculos(id) on delete set null,
  operacion_id int references operaciones(id) on delete set null,
  cuenta_id int references cuentas(id) on delete set null,
  category_id int references categorias(id) on delete set null,
  amount numeric(12,2) not null,
  type text check (type in ('ingreso','egreso')) not null,
  source text,
  description text,
  estado_categorizacion text check (estado_categorizacion in ('pendiente','categorizado')) default 'pendiente',
  fecha date not null,
  created_at timestamp with time zone default now()
);

-- 8. Configuración (valores de negocio TODO — no inventar, completar con Mariano)
create table if not exists config (
  key text primary key,
  value text
);

-- Índices
create index if not exists idx_movimientos_vehiculo on movimientos(vehiculo_id);
create index if not exists idx_movimientos_cuenta on movimientos(cuenta_id);
create index if not exists idx_operaciones_vehiculo on operaciones(vehiculo_id);
create index if not exists idx_operaciones_cliente on operaciones(cliente_id);

-- 9. Row Level Security
alter table roles enable row level security;
alter table user_roles enable row level security;
alter table vehiculos enable row level security;
alter table clientes enable row level security;
alter table categorias enable row level security;
alter table cuentas enable row level security;
alter table operaciones enable row level security;
alter table movimientos enable row level security;
alter table config enable row level security;

create or replace function public.is_admin() returns boolean
language sql stable security definer as $$
  select coalesce((
    select exists (
      select 1
      from user_roles ur
      join roles r on r.id = ur.role_id
      where ur.user_id = auth.uid() and r.name = 'admin'
    )
  ), false)
$$;

create policy "roles_read" on roles for select to authenticated using (true);
create policy "user_roles_own_read" on user_roles for select to authenticated using (auth.uid() = user_id);
create policy "user_roles_admin_all" on user_roles for all to authenticated using (public.is_admin());

create policy "vehiculos_auth_all" on vehiculos for all to authenticated using (true);
create policy "clientes_auth_all" on clientes for all to authenticated using (true);
create policy "categorias_auth_all" on categorias for all to authenticated using (true);
create policy "cuentas_auth_all" on cuentas for all to authenticated using (true);
create policy "operaciones_auth_all" on operaciones for all to authenticated using (true);
create policy "movimientos_auth_all" on movimientos for all to authenticated using (true);

create policy "config_admin_read" on config for select to authenticated using (public.is_admin());
create policy "config_admin_write" on config for insert, update, delete to authenticated using (public.is_admin());
