import { format, eachDayOfInterval, add } from "date-fns";

import { isWeekDay } from "../utils";

export interface IArchiveMonth {
  month: string;
  days: Date[];
}

export interface IArchiveYear {
  year: string;
  months: Map<string, IArchiveMonth>;
}

export type IArchiveYears = Map<string, IArchiveYear>;

export const START_DATE = new Date(2021, 9, 25);
export const TODAY = new Date();
export const TODAY_API_QUERY = format(TODAY, "dd/LL/yyyy");
export const TODAY_ROUTE_QUERY = format(TODAY, "yyyy-LL-dd");

export function getStartArchive(): IArchiveYears {
  return new Map([
    [
      format(TODAY, "yyyy"),
      {
        year: format(TODAY, "yyyy"),
        months: new Map([
          [
            format(TODAY, "LLLL"),
            {
              month: format(TODAY, "LLLL"),
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
    const currMonthLLLL = format(curr, "LLLL");
    const firstDayOfMonth = {
      month: currMonthLLLL,
      days: isWeekDay(curr) ? [curr] : [],
    };
    if (accMonth.month === "January" && currMonthLLLL === "December") {
      // Is the first of a new year
      acc.set(currYear, {
        year: currYear,
        months: new Map([[currMonthLLLL, firstDayOfMonth]]),
      });
    } else if (accMonth.month !== currMonthLLLL) {
      // Is first day of a new month
      accYear.months.set(currMonthLLLL, firstDayOfMonth);
    } else if (accMonth.month === currMonthLLLL && isWeekDay(curr)) {
      // Is just another day
      accMonth.days.unshift(curr);
    }
    return acc;
  }, getStartArchive());

export const ARCHIVE_YEARS = Array.from(ARCHIVE.values());
