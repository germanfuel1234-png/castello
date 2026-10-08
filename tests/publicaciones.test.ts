import { describe, expect, it } from "vitest";
import {
  estadoEnCanal,
  publicacionesPendientes,
  validarVehiculoParaPublicar,
  vehiculoToListingPayload,
} from "@/lib/business/publicaciones";
import { MetaCatalogoPublisher } from "@/lib/integrations/meta-catalogo";
import { MotordillPublisher } from "@/lib/integrations/motordill";
import { IntegrationNotConfiguredError } from "@/lib/integrations/types";
import type { Publicacion, Vehiculo, VehiculoFoto } from "@/lib/types/database";

const vehiculo: Vehiculo = {
  id: 1,
  marca: "Toyota",
  modelo: "Corolla",
  version: "XLI 2.0 CVT",
  anio: 2022,
  patente: "AC222CC",
  km: 21000,
  color: "Negro",
  combustible: "nafta",
  transmision: "automatica",
  tipo_carroceria: "sedan",
  puertas: 4,
  motor: "2.0",
  direccion: "electrica",
  cargado_por: "mariano",
  acepta_permuta: true,
  precio_negociable: false,
  descripcion: "Excelente estado general.",
  estado: "disponible",
  precio: 21000000,
  moneda: "ars",
  created_at: "2026-07-20T00:00:00Z",
};

const unaFoto: VehiculoFoto[] = [
  { id: 1, vehiculo_id: 1, archivo: "foto1.jpg", orden: 0, created_at: "2026-07-20T00:00:00Z" },
];

describe("vehiculoToListingPayload", () => {
  it("arma el título con marca, modelo y versión", () => {
    const payload = vehiculoToListingPayload(vehiculo, unaFoto);
    expect(payload.titulo).toBe("Toyota Corolla XLI 2.0 CVT");
    expect(payload.vehiculoId).toBe(1);
  });

  it("omite la versión del título si no está cargada", () => {
    const payload = vehiculoToListingPayload({ ...vehiculo, version: null }, unaFoto);
    expect(payload.titulo).toBe("Toyota Corolla");
  });

  it("arma las URLs de las fotos en orden", () => {
    const payload = vehiculoToListingPayload(vehiculo, unaFoto);
    expect(payload.fotos).toEqual(["/uploads/vehiculos/1/foto1.jpg"]);
  });
});

describe("validarVehiculoParaPublicar", () => {
  it("no tiene errores para un vehículo disponible con precio y al menos 1 foto", () => {
    expect(validarVehiculoParaPublicar(vehiculo, 1)).toEqual([]);
  });

  it("rechaza vehículos que no están disponibles", () => {
    const errores = validarVehiculoParaPublicar({ ...vehiculo, estado: "a_ingresar" }, 1);
    expect(errores).toContain("Solo se publican vehículos en estado 'disponible'.");
  });

  it("rechaza vehículos sin precio", () => {
    const errores = validarVehiculoParaPublicar({ ...vehiculo, precio: null }, 1);
    expect(errores).toContain("Falta cargar el precio.");
  });

  it("rechaza vehículos sin fotos", () => {
    const errores = validarVehiculoParaPublicar(vehiculo, 0);
    expect(errores).toContain("Falta cargar al menos una foto.");
  });
});

describe("publicacionesPendientes / estadoEnCanal", () => {
  const pubs: Publicacion[] = [
    { id: 1, vehiculo_id: 1, canal: "motordill", estado: "publicado", external_id: "X", mensaje_error: null, actualizado_at: "2026-01-01T00:00:00Z", created_at: "2026-01-01T00:00:00Z" },
    { id: 2, vehiculo_id: 1, canal: "meta_catalogo", estado: "pendiente", external_id: null, mensaje_error: null, actualizado_at: "2026-01-01T00:00:00Z", created_at: "2026-01-01T00:00:00Z" },
  ];

  it("filtra solo las pendientes", () => {
    expect(publicacionesPendientes(pubs).map((p) => p.id)).toEqual([2]);
  });

  it("encuentra el estado de un vehículo en un canal", () => {
    expect(estadoEnCanal(pubs, 1, "motordill")?.estado).toBe("publicado");
    expect(estadoEnCanal(pubs, 1, "meta_catalogo")?.estado).toBe("pendiente");
  });

  it("devuelve null si todavía no se intentó publicar en ese canal", () => {
    expect(estadoEnCanal(pubs, 99, "motordill")).toBeNull();
  });
});

describe("Conectores — scaffolding sin credenciales", () => {
  it("Motordill tira IntegrationNotConfiguredError listando las variables que faltan", async () => {
    const publisher = new MotordillPublisher();
    await expect(publisher.publish(vehiculoToListingPayload(vehiculo, unaFoto))).rejects.toMatchObject({
      constructor: IntegrationNotConfiguredError,
      faltantes: expect.arrayContaining(["MOTORDILL_API_KEY"]),
    });
  });

  it("Meta Catálogo tira IntegrationNotConfiguredError listando las variables que faltan", async () => {
    const publisher = new MetaCatalogoPublisher();
    await expect(publisher.publish(vehiculoToListingPayload(vehiculo, unaFoto))).rejects.toMatchObject({
      constructor: IntegrationNotConfiguredError,
      faltantes: expect.arrayContaining(["META_ACCESS_TOKEN", "META_CATALOG_ID", "META_BUSINESS_ID"]),
    });
  });
});
