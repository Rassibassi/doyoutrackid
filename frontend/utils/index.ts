import { getDay, isWithinInterval, set } from "date-fns";

export function isWeekDay(date: Date) {
  const day = getDay(date);
  return day !== 0 && day !== 6;
}

export function isElevenElevenBetween(date1: Date, date2: Date) {
  const elevenEleven = set(date1, { hours: 11, minutes: 11, seconds: 0 });
  const start = date1 > date2 ? date2 : date1;
  const end = date1 > date2 ? date1 : date2;
  return isWithinInterval(elevenEleven, { start, end });
}
