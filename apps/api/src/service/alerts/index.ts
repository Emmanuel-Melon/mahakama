import { alertsConfig } from "@/config";

import { sendSystemAlert } from "./alerts.core";
import { AlertRegistry } from "./alerts.registry";
import {
  circuitBreakerAlertGenerators,
  CircuitBreakerAlertTemplates,
} from "./topics/circuit-breaker.alerts";

// Register all alert topics at module load
AlertRegistry.register({
  map: CircuitBreakerAlertTemplates,
  generators: circuitBreakerAlertGenerators,
});

/**
 * Central system alerter.
 */
export const SystemAlerter = {
  storageDegraded: async (
    payload: Parameters<
      typeof circuitBreakerAlertGenerators.STORAGE_DEGRADED
    >[0],
  ) => {
    const content = await AlertRegistry.generateAlertContent(
      "STORAGE_DEGRADED",
      payload,
    );
    await sendSystemAlert("warning", alertsConfig.engineeringEmail, content);
  },
};
