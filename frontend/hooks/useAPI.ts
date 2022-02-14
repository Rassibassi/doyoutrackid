import useSWR from "swr";
import { PublicConfiguration, BareFetcher } from "swr/dist/types";

import { ITrackResponse } from "../constants/tracks";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useAPI(
  route: string,
  options:
    | Partial<
        PublicConfiguration<ITrackResponse, any, BareFetcher<ITrackResponse>>
      >
    | undefined
) {
  const { data, error } = useSWR<ITrackResponse>(
    `${process.env.NEXT_PUBLIC_API_SERVICE_URL}${route}`,
    fetcher,
    options
  );

  return {
    tracks: data?.tracks,
    isLoading: !error && !data,
    error,
  };
}
