import { describe, it, expect } from "vitest";
import { extractDateFromNameWithFormat_MonthDay_RestIgnored } from "../NLT_FilesUtils";

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
