import type { ListingPublisher, PublishResult, VehiculoListingPayload } from "@/lib/integrations/types";
import { IntegrationNotConfiguredError } from "@/lib/integrations/types";

/**
 * Un solo Catálogo de Meta Commerce Manager alimenta WhatsApp Catalog,
 * Instagram Shopping y Facebook Shop a la vez — por eso un solo conector
 * cubre las tres plataformas en vez de tres conectores idénticos.
 */
export class MetaCatalogoPublisher implements ListingPublisher {
  readonly canal = "meta_catalogo" as const;

  async publish(_listing: VehiculoListingPayload): Promise<PublishResult> {
    const accessToken = process.env.META_ACCESS_TOKEN;
    const catalogId = process.env.META_CATALOG_ID;
    const businessId = process.env.META_BUSINESS_ID;
    const faltantes = [
      !accessToken ? "META_ACCESS_TOKEN" : null,
      !catalogId ? "META_CATALOG_ID" : null,
      !businessId ? "META_BUSINESS_ID" : null,
    ].filter((v): v is string => v !== null);
    if (faltantes.length > 0) {
      throw new IntegrationNotConfiguredError("Catálogo de Meta (WhatsApp/Instagram/Facebook)", faltantes);
    }
    throw new Error("Catálogo de Meta: credenciales presentes pero la llamada real todavía no está implementada.");
  }

  async unpublish(_externalId: string): Promise<void> {
    throw new Error("Catálogo de Meta: unpublish todavía no está implementado.");
  }
}
