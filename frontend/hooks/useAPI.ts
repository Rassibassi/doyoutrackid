import useSWR from "swr";

import { ITrackResponse } from "../constants/tracks";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useAPI(date: string) {
  const { data, error } = useSWR<ITrackResponse>(
    `${process.env.NEXT_PUBLIC_API_SERVICE_URL}/${date}`,
    fetcher,
    { focusThrottleInterval: 60000 }
  );

  return {
    tracks: data?.tracks,
    isLoading: !error && !data,
    error,
  };
}
