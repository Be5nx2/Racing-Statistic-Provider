import { Nullable } from "./tools/type";
import fs from "fs";

// format of the file is :
// lap, user1, user2, user3, ...
// 1, 10.1, 10.2, 10.3, ...
// 2, 10.4, 10.5, 10.6, ...
// 3, 10.7, 10.8, 10.9, ...



export type NLT_UserData = {
    userName : string;
    date : string;
    lapTimes : number[];
    lapNumber : number;
}

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

export function parseNLT_RawData(filename: string): NLT_UserData[]    {
    const date = extractDateFromNameWithFormat_MonthDay_RestIgnored(filename);
    if (!date) return [];
    const rawData = fs.readFileSync(filename, "utf8");
    const lines = rawData.split("\n");
    const headers = lines[0].split(",");    
    const userNames = headers.slice(1).map(header => header.trim()); 

    const userRawDataByIndex = new Map<number, number[]>();
    for (let i = 0; i < userNames.length; i++) {
        userRawDataByIndex.set(i+1, []);
    }

    for (const line of lines.slice(1)) {
        const [lapNumber, ...lapTimes] = line.split(",");
        for (let i = 0; i < lapTimes.length; i++) {
            userRawDataByIndex.get(i+1)?.push(Number(lapTimes[i]));
        }
    }

    return Array.from(userRawDataByIndex.entries()).map(([index, lapTimes]) => {
        return {
            userName: userNames[index-1],
            date,
            lapTimes,
            lapNumber: lapTimes.length
        };
    });
}