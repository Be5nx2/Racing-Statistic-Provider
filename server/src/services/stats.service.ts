/**
 * Stats service – services domain.
 * Business logic for racing statistics (placeholder until real implementation).
 */

import { listFiles } from "../library/directory";
import { extractDateFromNameWithFormat_MonthDay_RestIgnored } from "../library/NLT_FilesUtils";
export interface StatsResult {
  message: string;
}

export function getStats(): StatsResult {
  const files = listFiles("./input");
  const dates = files.map(extractDateFromNameWithFormat_MonthDay_RestIgnored);
  const uniqueDates = [...new Set(dates)];
  return { message: `Found ${uniqueDates} unique dates in ${files.length} files in ./input` };
}
