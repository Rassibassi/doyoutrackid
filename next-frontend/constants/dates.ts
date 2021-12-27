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

export const START_ARCHIVE: IArchiveYears = new Map([
  [
    format(START_DATE, "yyyy"),
    {
      year: format(START_DATE, "yyyy"),
      months: new Map([
        [
          format(START_DATE, "LLLL"),
          {
            month: format(START_DATE, "LLLL"),
            days: [START_DATE],
          },
        ],
      ]),
    },
  ],
]);

export const ARCHIVE: IArchiveYears = eachDayOfInterval({
  start: add(START_DATE, { days: 1 }),
  end: TODAY,
}).reduce((acc, curr) => {
  const accYear = Array.from(acc.values())[acc.size - 1];
  const accMonth = Array.from(accYear.months.values())[accYear.months.size - 1];
  const currYear = format(curr, "yyyy");
  const currMonthL = Number(format(curr, "L"));
  const currMonthLLLL = format(curr, "LLLL");
  const currDay = Number(format(curr, "d"));
  const firstDayOfMonth = {
    month: currMonthLLLL,
    days: isWeekDay(curr) ? [curr] : [],
  };
  if (currDay === 1 && currMonthL === 1) {
    // Is the first of a new year
    acc.set(currYear, {
      year: currYear,
      months: new Map([[currMonthLLLL, firstDayOfMonth]]),
    });
  }
  if (currDay === 1 && currMonthL !== 1) {
    // Is first day of a new month
    accYear.months.set(currMonthLLLL, firstDayOfMonth);
  }
  if (currDay !== 1 && currMonthL !== 1 && isWeekDay(curr)) {
    // Is just another day
    accMonth.days.push(curr);
  }
  return acc;
}, START_ARCHIVE);

export const ARCHIVE_YEARS = Array.from(ARCHIVE.values());

export const ARCHIVE_DAYS = eachDayOfInterval({
  start: START_DATE,
  end: TODAY,
}).filter(isWeekDay);
