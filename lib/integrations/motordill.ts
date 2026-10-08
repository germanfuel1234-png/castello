import type { ListingPublisher, PublishResult, VehiculoListingPayload } from "@/lib/integrations/types";
import { IntegrationNotConfiguredError } from "@/lib/integrations/types";

/**
 * Motordill ya empuja automáticamente a MercadoLibre (confirmado por Mariano),
 * así que este conector cubre ambos destinos — no hay uno separado para ML.
 *
 * MOTORDILL_INTEGRATION_METHOD (API propia / feed XML / otro) todavía no está
 * confirmado con Mariano — no inventar el método hasta tenerlo.
 */
export class MotordillPublisher implements ListingPublisher {
  readonly canal = "motordill" as const;

  async publish(_listing: VehiculoListingPayload): Promise<PublishResult> {
    const apiKey = process.env.MOTORDILL_API_KEY;
    const metodo = process.env.MOTORDILL_INTEGRATION_METHOD;
    const faltantes = [
      !apiKey ? "MOTORDILL_API_KEY" : null,
      !metodo ? "MOTORDILL_INTEGRATION_METHOD" : null,
    ].filter((v): v is string => v !== null);
    if (faltantes.length > 0) {
      throw new IntegrationNotConfiguredError("Motordill", faltantes);
    }
    throw new Error("Motordill: credenciales presentes pero la llamada real todavía no está implementada.");
  }

  async unpublish(_externalId: string): Promise<void> {
    throw new Error("Motordill: unpublish todavía no está implementado.");
  }
}
