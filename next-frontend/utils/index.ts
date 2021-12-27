import { getDay } from "date-fns";

export function isWeekDay(date: Date) {
  const day = getDay(date);
  return day !== 0 && day !== 6;
}
