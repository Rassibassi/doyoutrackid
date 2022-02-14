import { format, eachDayOfInterval, add } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";

import { isWeekDay } from "../utils";

export interface IArchiveMonth {
  path: string;
  label: string;
  days: Date[];
}

export interface IArchiveYear {
  year: string;
  months: Map<string, IArchiveMonth>;
}

export type IArchiveYears = Map<string, IArchiveYear>;

export const START_DATE = new Date(2021, 9, 25);
export const TODAY = new Date();
export const TODAY_YEAR = format(TODAY, "yyyy");
export const TODAY_MONTH = format(TODAY, "LLLL");
export const TODAY_API_QUERY = format(TODAY, "dd/LL/yyyy");
export const TODAY_ISO = format(TODAY, "yyyy-LL-dd");
export const ELEVEN_ELEVEN_START = zonedTimeToUtc(
  `${TODAY_ISO} 11:11`,
  "Europe/London"
);
export const ELEVEN_ELEVEN_END = zonedTimeToUtc(
  `${TODAY_ISO} 11:12`,
  "Europe/London"
);
export const ELEVEN_ELEVEN_INTERVAL = {
  start: ELEVEN_ELEVEN_START,
  end: ELEVEN_ELEVEN_END,
};

export function getStartArchive(): IArchiveYears {
  return new Map([
    [
      TODAY_YEAR,
      {
        year: TODAY_YEAR,
        months: new Map([
          [
            TODAY_MONTH.toLocaleLowerCase(),
            {
              label: TODAY_MONTH,
              path: TODAY_MONTH.toLocaleLowerCase(),
              days: isWeekDay(TODAY) ? [TODAY] : [],
            },
          ],
        ]),
      },
    ],
  ]);
}

export const ARCHIVE: IArchiveYears = eachDayOfInterval({
  start: START_DATE,
  end: add(TODAY, { days: -1 }),
})
  .reverse()
  .reduce((acc, curr) => {
    const accYear = Array.from(acc.values())[acc.size - 1];
    const accMonth = Array.from(accYear.months.values())[
      accYear.months.size - 1
    ];
    const currYear = format(curr, "yyyy");
    const currMonthLabel = format(curr, "LLLL");
    const currMonthPath = format(curr, "LLLL").toLocaleLowerCase();
    const firstDayOfMonth: IArchiveMonth = {
      label: currMonthLabel,
      path: currMonthPath,
      days: isWeekDay(curr) ? [curr] : [],
    };
    if (accMonth.path === "january" && currMonthPath === "december") {
      // Is the first of a new year
      acc.set(currYear, {
        year: currYear,
        months: new Map([[currMonthPath, firstDayOfMonth]]),
      });
    } else if (accMonth.path !== currMonthPath) {
      // Is first day of a new month
      accYear.months.set(currMonthPath, firstDayOfMonth);
    } else if (accMonth.path === currMonthPath && isWeekDay(curr)) {
      // Is just another day
      accMonth.days.unshift(curr);
    }
    return acc;
  }, getStartArchive());

export const ARCHIVE_YEARS = Array.from(ARCHIVE.values());
