import { Nullable } from "./tools/type";

/**
 * Extracts month and day from a filename in the format "month-day-...".
 * First bloc = month, second bloc = day; the rest is ignored.
 * @param filename - The filename to extract the date from (e.g. "february-3-816-pm-laps-data.csv").
 * @returns The date string "month-day" (month lowercased), or null if the filename has no valid two-bloc prefix.
 */
export function extractDateFromNameWithFormat_MonthDay_RestIgnored(filename: string): Nullable<string> {
    const base = filename.replace(/\.csv$/i, "").trim();
    const blocs = base.split("-");
    if (blocs.length < 2) return null;
    const month = blocs[0].trim();
    const day = blocs[1].trim();
    if (!month || !/^\d{1,2}$/.test(day)) return null;
    return `${month.toLowerCase()}-${day}`;
}   