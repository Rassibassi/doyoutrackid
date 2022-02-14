import { ParsedUrlQuery } from "querystring";

import format from "date-fns/format";
import { eachDayOfInterval } from "date-fns";

import { TODAY, START_DATE } from "./dates";

export const TRACKS_PATHS: { params: ParsedUrlQuery }[] = eachDayOfInterval({
  start: START_DATE,
  end: TODAY,
}).map((date) => ({
  params: {
    date: format(date, "yyyy-LL-dd"),
  },
}));
