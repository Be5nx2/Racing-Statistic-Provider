/**
 * Health service – services domain.
 * Business logic for health / readiness.
 */

export interface HealthResult {
  status: "ok";
}

export function getHealth(): HealthResult {
  return { status: "ok" };
}
