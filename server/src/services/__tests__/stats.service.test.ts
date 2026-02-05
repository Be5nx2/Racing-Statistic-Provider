import { describe, it, expect, vi, beforeEach } from "vitest";
import { getStats, type StatsResult, type UserStatsResult } from "../stats.service";

vi.mock("../../library/directory", () => ({
  listFiles: vi.fn(),
}));

vi.mock("../../library/NLT_FilesUtils", () => ({
  parseNLT_RawData: vi.fn(),
}));

import { listFiles } from "../../library/directory";
import { parseNLT_RawData } from "../../library/NLT_FilesUtils";

const mockListFiles = vi.mocked(listFiles);
const mockParseNLT_RawData = vi.mocked(parseNLT_RawData);

describe("stats.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getStats", () => {
    it("returns result with userStats, minLapTime and maxLapTime", () => {
      mockListFiles.mockReturnValue([]);
      mockParseNLT_RawData.mockReturnValue([]);

      const result = getStats();

      expect(result).toMatchObject({
        userStats: [],
        minLapTime: 12,
        maxLapTime: 20,
      });
    });

    it("aggregates lap times from multiple files for the same user", () => {
      mockListFiles.mockReturnValue(["file1.csv", "file2.csv"]);
      mockParseNLT_RawData
        .mockReturnValueOnce([
          { userName: "Alice", date: "jan-1", lapTimes: [14, 16, 18], lapNumber: 3 },
        ])
        .mockReturnValueOnce([
          { userName: "Alice", date: "jan-2", lapTimes: [15, 17], lapNumber: 2 },
        ]);

      const result = getStats();

      expect(result.userStats).toHaveLength(1);
      expect(result.userStats[0].userName).toBe("Alice");
      expect(result.userStats[0].lapNumber).toBe(5);
      expect(result.userStats[0].bestLapTime).toBe(14);
      // average of [14,16,18,15,17] = 80/5 = 16
      expect(result.userStats[0].averageLapTime).toBe(16);
      expect(result.userStats[0].tenBestLapTimes).toEqual([14, 15, 16, 17, 18]);
      expect(result.userStats[0].averageTenBestLapTimes).toBe(16);
    });

    it("sanitizes lap times with MIN_LAP_TIME and MAX_LAP_TIME", () => {
      mockListFiles.mockReturnValue(["file1.csv"]);
      // 10 and 22 are outside [12, 20], so only 14, 16, 18 count
      mockParseNLT_RawData.mockReturnValueOnce([
        { userName: "Bob", date: "feb-1", lapTimes: [10, 14, 16, 18, 22], lapNumber: 5 },
      ]);

      const result = getStats();

      expect(result.userStats[0].lapNumber).toBe(5); // raw count
      expect(result.userStats[0].bestLapTime).toBe(14);
      expect(result.userStats[0].averageLapTime).toBe(16); // (14+16+18)/3
      expect(result.userStats[0].tenBestLapTimes).toEqual([14, 16, 18]);
      expect(result.userStats[0].averageTenBestLapTimes).toBe(16);
    });

    it("returns multiple users when multiple users exist across files", () => {
      mockListFiles.mockReturnValue(["file1.csv"]);
      mockParseNLT_RawData.mockReturnValueOnce([
        { userName: "Alice", date: "jan-1", lapTimes: [14, 16], lapNumber: 2 },
        { userName: "Bob", date: "jan-1", lapTimes: [13, 15, 17], lapNumber: 3 },
      ]);

      const result = getStats();

      expect(result.userStats).toHaveLength(2);
      const alice = result.userStats.find((u) => u.userName === "Alice") as UserStatsResult;
      const bob = result.userStats.find((u) => u.userName === "Bob") as UserStatsResult;
      expect(alice.bestLapTime).toBe(14);
      expect(alice.averageLapTime).toBe(15);
      expect(alice.tenBestLapTimes).toEqual([14, 16]);
      expect(alice.averageTenBestLapTimes).toBe(15);
      expect(bob.bestLapTime).toBe(13);
      expect(bob.averageLapTime).toBe(15);
      expect(bob.tenBestLapTimes).toEqual([13, 15, 17]);
      expect(bob.averageTenBestLapTimes).toBe(15);
    });

    it("caps tenBestLapTimes at 10 and averageTenBestLapTimes uses only those 10", () => {
      mockListFiles.mockReturnValue(["file1.csv"]);
      // 15 laps in range [12,20]; ten best are the 10 smallest
      const manyLaps = [20, 19, 18, 17, 16, 15, 14, 13, 12, 12, 13, 14, 15, 16, 17];
      mockParseNLT_RawData.mockReturnValueOnce([
        { userName: "Many", date: "jan-1", lapTimes: manyLaps, lapNumber: 15 },
      ]);

      const result = getStats();

      const tenBest = result.userStats[0].tenBestLapTimes;
      expect(tenBest).toHaveLength(10);
      expect(tenBest).toEqual([12, 12, 13, 13, 14, 14, 15, 15, 16, 16]);
      const expectedAvg = tenBest.reduce((s, t) => s + t, 0) / tenBest.length;
      expect(result.userStats[0].averageTenBestLapTimes).toBe(expectedAvg);
    });

    it("calls listFiles with ./input and parseNLT_RawData with correct path per file", () => {
      mockListFiles.mockReturnValue(["a.csv", "b.csv"]);
      mockParseNLT_RawData.mockReturnValue([]);

      getStats();

      expect(mockListFiles).toHaveBeenCalledWith("./input");
      expect(mockParseNLT_RawData).toHaveBeenCalledWith("./input/a.csv");
      expect(mockParseNLT_RawData).toHaveBeenCalledWith("./input/b.csv");
    });
  });
});
