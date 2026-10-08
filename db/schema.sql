-- MySQL schema for Castello · Gestión (Fase 1)
-- Multi-moneda (ARS/USD) — confirmado con un boleto de preventa real (LEMA SRL, PV 125).
-- Se ajusta cuando Mariano confirme el resto de su planilla/reglas de negocio.
--
-- Sin autenticación todavía (ver README §5): no hay tablas roles/user_roles
-- ni permisos por fila (RLS no existe en MySQL) — se agregan cuando haya
-- un sistema de auth real, no se inventan ahora.

-- 1. Vehículos (unidades)
create table if not exists vehiculos (
  id int auto_increment primary key,
  marca varchar(100) not null,
  modelo varchar(100) not null,
  version varchar(100),
  anio int,
  patente varchar(20),
  km int,
  color varchar(50),
  combustible enum('nafta','diesel','gnc','electrico','hibrido'),
  transmision enum('manual','automatica'),
  tipo_carroceria enum('sedan','hatchback','suv','pickup','furgon','coupe','rural','otro'),
  puertas int,
  motor varchar(50),
  direccion enum('mecanica','hidraulica','electrica'),
  cargado_por enum('mariano','leandro'),
  acepta_permuta boolean not null default false,
  precio_negociable boolean not null default false,
  descripcion text,
  estado enum('disponible','reservado','vendido','a_ingresar') not null default 'disponible',
  precio decimal(12,2),
  moneda enum('ars','usd'),
  created_at datetime not null default current_timestamp
) engine=innodb;

-- 2. Clientes
create table if not exists clientes (
  id int auto_increment primary key,
  name varchar(150) not null,
  dni varchar(20),
  email varchar(150),
  phone varchar(50),
  fecha_nacimiento date,
  profesion varchar(100),
  estado_civil enum('soltero','casado','divorciado','viudo','union_convivencial'),
  conyuge_nombre varchar(150),
  conyuge_dni varchar(20),
  calle varchar(150),
  numero varchar(20),
  localidad varchar(100),
  cp varchar(20),
  created_at datetime not null default current_timestamp
) engine=innodb;

-- 3. Categorías de ingreso/egreso
create table if not exists categorias (
  id int auto_increment primary key,
  name varchar(100) not null unique,
  tipo enum('ingreso','egreso') not null,
  description varchar(255)
) engine=innodb;

-- 4. Cuentas / medios de pago (todo en ARS)
create table if not exists cuentas (
  id int auto_increment primary key,
  name varchar(100) not null,
  tipo enum('banco','efectivo','billetera_virtual') not null default 'efectivo',
  created_at datetime not null default current_timestamp
) engine=innodb;

-- 5. Operaciones (ventas) — espejo de un boleto de preventa real (LEMA SRL)
create table if not exists operaciones (
  id int auto_increment primary key,
  pv_numero varchar(50),
  vendedor varchar(100),
  vehiculo_id int,
  cliente_id int,
  fecha date not null,
  moneda enum('ars','usd') not null default 'ars',
  precio_venta decimal(12,2) not null,
  costo_transferencia decimal(12,2),
  costo_formularios decimal(12,2),
  costo_certificacion_firmas decimal(12,2),
  costo_accesorios decimal(12,2),
  -- Vehículo del cliente tomado como parte de pago (no es stock propio)
  permuta_dominio varchar(20),
  permuta_marca varchar(100),
  permuta_modelo varchar(100),
  permuta_anio int,
  permuta_km int,
  permuta_precio decimal(12,2),
  comentarios text,
  forma_pago enum('contado','financiado') not null default 'contado',
  estado enum('pendiente','confirmada','entregada') not null default 'pendiente',
  created_at datetime not null default current_timestamp,
  foreign key (vehiculo_id) references vehiculos(id) on delete set null,
  foreign key (cliente_id) references clientes(id) on delete set null
) engine=innodb;

-- 6. Movimientos (ingresos/egresos) — pagos parciales, multi-moneda con tipo de cambio
create table if not exists movimientos (
  id int auto_increment primary key,
  vehiculo_id int,
  operacion_id int,
  cuenta_id int,
  category_id int,
  amount decimal(12,2) not null,
  moneda enum('ars','usd') not null default 'ars',
  tipo_cambio decimal(12,4),
  modalidad enum('efectivo','transferencia','cheque','tarjeta','otro'),
  type enum('ingreso','egreso') not null,
  source varchar(50),
  description varchar(255),
  estado_categorizacion enum('pendiente','categorizado') not null default 'pendiente',
  fecha date not null,
  created_at datetime not null default current_timestamp,
  foreign key (vehiculo_id) references vehiculos(id) on delete set null,
  foreign key (operacion_id) references operaciones(id) on delete set null,
  foreign key (cuenta_id) references cuentas(id) on delete set null,
  foreign key (category_id) references categorias(id) on delete set null
) engine=innodb;

-- 7. Configuración (valores de negocio TODO — no inventar, completar con Mariano)
create table if not exists config (
  `key` varchar(100) primary key,
  value varchar(255)
) engine=innodb;

-- 8. Publicaciones — estado de publicación de un vehículo por canal externo.
-- 'motordill' cubre Motordill + MercadoLibre (Motordill ya empuja a ML).
-- 'meta_catalogo' cubre WhatsApp Catalog + Instagram + Facebook (mismo
-- catálogo de Meta Commerce Manager alimenta las tres superficies).
create table if not exists publicaciones (
  id int auto_increment primary key,
  vehiculo_id int not null,
  canal enum('motordill','meta_catalogo') not null,
  estado enum('pendiente','publicado','error','pausado') not null default 'pendiente',
  external_id varchar(100),
  mensaje_error text,
  actualizado_at datetime not null default current_timestamp,
  created_at datetime not null default current_timestamp,
  unique key uq_publicaciones_vehiculo_canal (vehiculo_id, canal),
  foreign key (vehiculo_id) references vehiculos(id) on delete cascade
) engine=innodb;

-- 9. Fotos de vehículos (orden de aparición en las publicaciones)
create table if not exists vehiculo_fotos (
  id int auto_increment primary key,
  vehiculo_id int not null,
  archivo varchar(255) not null,
  orden int not null default 0,
  created_at datetime not null default current_timestamp,
  foreign key (vehiculo_id) references vehiculos(id) on delete cascade
) engine=innodb;

-- Índices
create index idx_movimientos_vehiculo on movimientos(vehiculo_id);
create index idx_movimientos_cuenta on movimientos(cuenta_id);
create index idx_operaciones_vehiculo on operaciones(vehiculo_id);
create index idx_operaciones_cliente on operaciones(cliente_id);
create index idx_publicaciones_vehiculo on publicaciones(vehiculo_id);
create index idx_vehiculo_fotos_vehiculo on vehiculo_fotos(vehiculo_id);
