import { getTime, isWithinInterval } from "date-fns";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { ELEVEN_ELEVEN_INTERVAL, TODAY } from "../constants/dates";

export function useIsElevenEleven(): [
  boolean,
  Dispatch<SetStateAction<boolean>>
] {
  const [isElevenEleven, setIsElevenEleven] = useState(false);

  // For first render e.g. server side
  if (!isElevenEleven && isWithinInterval(TODAY, ELEVEN_ELEVEN_INTERVAL)) {
    setIsElevenEleven(true);
  }

  useEffect(() => {
    function handleStart() {
      setIsElevenEleven(true);
    }

    let millsTill1111 = getTime(ELEVEN_ELEVEN_INTERVAL.start) - getTime(TODAY);
    // If past 11:11 today, start at 11:11 tomorrow
    if (millsTill1111 < 0) {
      millsTill1111 += 86400000; // 24h in ms
    }
    const startTimeout = setTimeout(handleStart, millsTill1111);

    return () => clearTimeout(startTimeout);
  }, []);

  useEffect(() => {
    function handleEnd() {
      setIsElevenEleven(false);
    }

    let millsTill1212 = getTime(ELEVEN_ELEVEN_INTERVAL.end) - getTime(TODAY);
    // If past 11:12 today, end at 11:12 tomorrow
    if (millsTill1212 < 0) {
      millsTill1212 += 86400000; // 24h in ms
    }
    const endTimeout = setTimeout(handleEnd, millsTill1212);

    return () => clearTimeout(endTimeout);
  }, []);

  return [isElevenEleven, setIsElevenEleven];
}
