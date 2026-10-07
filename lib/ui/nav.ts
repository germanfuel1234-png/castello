export interface NavLink {
  label: string;
  href: string;
  icono: string;
}

export interface NavGroup {
  titulo: string;
  links: NavLink[];
}

export const SIDEBAR_LINKS: NavGroup[] = [
  {
    titulo: "Vista general",
    links: [{ label: "Resumen", href: "/", icono: "▪" }],
  },
  {
    titulo: "Gestión",
    links: [
      { label: "Vehículos", href: "/vehiculos", icono: "🚗" },
      { label: "Cargar vehículo", href: "/vehiculos/nuevo", icono: "➕" },
      { label: "Clientes", href: "/clientes", icono: "👤" },
      { label: "Cargar cliente", href: "/clientes/nuevo", icono: "➕" },
      { label: "Operaciones", href: "/operaciones", icono: "🧾" },
      { label: "Cargar operación", href: "/operaciones/nueva", icono: "➕" },
      { label: "Movimientos", href: "/movimientos", icono: "💸" },
      { label: "Cargar movimiento", href: "/movimientos/nuevo", icono: "➕" },
    ],
  },
  {
    titulo: "Automatización",
    links: [{ label: "Cola pendientes", href: "/cola", icono: "📥" }],
  },
  {
    titulo: "Dashboards",
    links: [
      { label: "Por vehículo", href: "/dashboards/vehiculo", icono: "🚙" },
      { label: "Por categoría", href: "/dashboards/categoria", icono: "🗂️" },
      { label: "Por cuenta", href: "/dashboards/cuenta", icono: "🏦" },
    ],
  },
];
