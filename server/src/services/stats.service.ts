/**
 * Stats service – services domain.
 * Business logic for racing statistics (placeholder until real implementation).
 *
 */

import { listFiles } from "../library/directory";
import { parseNLT_RawData } from "../library/NLT_FilesUtils";

const MIN_LAP_TIME = 12;
const MAX_LAP_TIME = 20;


export interface UserStatsResult { // move to the endpoint result
  userName : string;
  bestLapTime : number;
  averageLapTime : number;
  averageTenBestLapTimes : number;
  tenBestLapTimes : number[];
  lapNumber : number;
}


export function getStats(): UserStatsResult[] {
  const mapLapTimesByUserName = new Map<string, number[]>();
  const files = listFiles("./input");
  // for each file, parse the data and add the lap times to the map
  for (const file of files) {
    const userData = parseNLT_RawData("./input/" + file);
    for (const user of userData) {
      const lapTimes = mapLapTimesByUserName.get(user.userName) || [];
      lapTimes.push(...user.lapTimes);
      mapLapTimesByUserName.set(user.userName, lapTimes);
    }
  }

  const stats : UserStatsResult[] = [];
  for (const [userName, lapTimes] of mapLapTimesByUserName.entries()) {
    const sanitizedLapTimes = sanitizeTimeLaps(lapTimes, MIN_LAP_TIME, MAX_LAP_TIME);
    stats.push({
      userName, 
      bestLapTime: getBestLapTime(sanitizedLapTimes),
      averageLapTime: getAverageLapTime(sanitizedLapTimes),
      tenBestLapTimes: getTenBestLapTimes(sanitizedLapTimes),
      averageTenBestLapTimes: getAverageLapTime(getTenBestLapTimes(sanitizedLapTimes)),
      lapNumber: lapTimes.length
    });
  }

  return stats;
}

/**
 * Sanitize the lap times.
 * @param lapTimes - The lap times to sanitize.
 * @param minLapTime - The minimum lap time.
 * @param maxLapTime - The maximum lap time.
 * @returns The sanitized lap times.
 */
function sanitizeTimeLaps(lapTimes: number[], minLapTime: number, maxLapTime: number): number[] {
  return lapTimes.filter(time => time >= minLapTime && time <= maxLapTime);
}

function getBestLapTime(lapTimes: number[]): number {
  return Math.min(...lapTimes);
}

function getAverageLapTime(lapTimes: number[]): number {
  return lapTimes.reduce((sum, time) => sum + time, 0) / lapTimes.length;
}

function getTenBestLapTimes(lapTimes: number[]): number[] {
  return lapTimes.sort((a, b) => a - b).slice(0, 10);
}