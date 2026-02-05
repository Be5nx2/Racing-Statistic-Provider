/**
 * Stats service – services domain.
 * Business logic for racing statistics (placeholder until real implementation).
 */

export interface StatsResult {
  message: string;
}

export function getStats(): StatsResult {
  return { message: "Racing statistics will be available soon." };
}
