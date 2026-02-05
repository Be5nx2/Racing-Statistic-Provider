/**
 * Services domain.
 * Business logic only – no HTTP, no framework details.
 */

export { getHealth, type HealthResult } from "./health.service";
export { getStats, type UserStatsResult as StatsResult } from "./stats.service";
