import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  extractDateFromNameWithFormat_MonthDay_RestIgnored,
  parseNLT_RawData,
  type NLT_UserData,
} from "../NLT_FilesUtils";

vi.mock("fs", () => ({
  default: {
    readFileSync: vi.fn(),
  },
}));

import fs from "fs";

const mockReadFileSync = vi.mocked(fs.readFileSync);

describe("extractDateFromNameWithFormat_MonthDay_RestIgnored", () => {
  it("should extract the first bloc as month, the second as day, and ignore the rest", () => {
    expect(extractDateFromNameWithFormat_MonthDay_RestIgnored("february-3-816-pm-laps-data.csv")).toBe("february-3");
    expect(extractDateFromNameWithFormat_MonthDay_RestIgnored("December-12-756.am-laps-data.csv")).toBe("december-12");
    expect(extractDateFromNameWithFormat_MonthDay_RestIgnored("february-3-816-pm.csv")).toBe("february-3");
  });

  it("returns null when there are fewer than two blocs", () => {
    expect(extractDateFromNameWithFormat_MonthDay_RestIgnored("random.csv")).toBe(null);
    expect(extractDateFromNameWithFormat_MonthDay_RestIgnored("")).toBe(null);
  });

  it("returns null when the second bloc is not a day number (1–2 digits)", () => {
    expect(extractDateFromNameWithFormat_MonthDay_RestIgnored("no-date-here.csv")).toBe(null);
    expect(extractDateFromNameWithFormat_MonthDay_RestIgnored("3-february-22.csv")).toBe(null);
  });

  it("returns null when the filename has no dash-separated blocs", () => {
    expect(extractDateFromNameWithFormat_MonthDay_RestIgnored("3_feb_22.csv")).toBe(null);
  });
});

describe("parseNLT_RawData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns empty array when filename does not yield a valid date", () => {
    const result = parseNLT_RawData("invalid.csv");
    expect(result).toEqual([]);
    expect(mockReadFileSync).not.toHaveBeenCalled();
  });

  it("parses CSV with lap column and user columns into NLT_UserData[]", () => {
    mockReadFileSync.mockReturnValue(
      "lap, Alice, Bob\n" +
        "1, 10.1, 10.2\n" +
        "2, 10.4, 10.5\n" +
        "3, 10.7, 10.8\n"
    );

    const result = parseNLT_RawData("january-5-laps.csv");

    expect(mockReadFileSync).toHaveBeenCalledWith("january-5-laps.csv", "utf8");
    expect(result).toHaveLength(2);

    expect(result[0]).toMatchObject({
      userName: "Alice",
      date: "january-5",
      lapNumber: 3,
    } as Partial<NLT_UserData>);
    expect(result[0].lapTimes).toEqual([10.1, 10.4, 10.7]);

    expect(result[1]).toMatchObject({
      userName: "Bob",
      date: "january-5",
      lapNumber: 3,
    } as Partial<NLT_UserData>);
    expect(result[1].lapTimes).toEqual([10.2, 10.5, 10.8]);
  });

  it("trims header names", () => {
    mockReadFileSync.mockReturnValue("lap,  Alice  , Bob \n1, 10.0, 11.0\n");

    const result = parseNLT_RawData("march-1-data.csv");

    expect(result[0].userName).toBe("Alice");
    expect(result[1].userName).toBe("Bob");
  });

  it("returns one user when only one data column exists", () => {
    mockReadFileSync.mockReturnValue("lap, Solo\n1, 12.5\n2, 13.0\n");

    const result = parseNLT_RawData("feb-9.csv");

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      userName: "Solo",
      date: "feb-9",
      lapTimes: [12.5, 13],
      lapNumber: 2,
    });
  });

  it("handles empty data rows (only headers)", () => {
    mockReadFileSync.mockReturnValue("lap, Alice, Bob\n");

    const result = parseNLT_RawData("april-1.csv");

    expect(result).toHaveLength(2);
    expect(result[0].lapTimes).toEqual([]);
    expect(result[0].lapNumber).toBe(0);
    expect(result[1].lapTimes).toEqual([]);
    expect(result[1].lapNumber).toBe(0);
  });
});   
