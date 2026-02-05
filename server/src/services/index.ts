/**
 * Services domain.
 * Business logic only – no HTTP, no framework details.
 */

export { getHealth, type HealthResult } from "./health.service";
export { getStats, type StatsResult } from "./stats.service";
