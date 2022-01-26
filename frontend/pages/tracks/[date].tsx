import { GetStaticProps, GetStaticPaths, NextPage } from "next";
import { format, parseISO } from "date-fns";
import { SWRConfig } from "swr";

import { TRACKS_PATHS } from "../../constants/paths";
import TracksScreen from "../../components/TracksScreen/TracksScreen";
import { ActiveDate } from "../../contexts/activeDate";
import { ITrackResponse } from "../../constants/tracks";

interface ITracksPageProps {
  dateISO: string;
  fallback: {
    [key: string]: ITrackResponse;
  };
}

const TracksPage: NextPage<ITracksPageProps> = ({ dateISO, fallback }) => {
  const date = parseISO(dateISO);
  return (
    <ActiveDate.Provider value={date}>
      <SWRConfig
        value={{
          fallback,
        }}
      >
        <TracksScreen />
      </SWRConfig>
    </ActiveDate.Provider>
  );
};

export default TracksPage;

// Remove current day (slice) as handled by tracks/[[...dates]].tsx
// Only these past days don't need revalidation of data and can be fully static
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: TRACKS_PATHS.slice(0, -1),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<ITracksPageProps> = async ({
  params,
}) => {
  const date = parseISO(String(params?.date));
  const apiDateQuery = format(date, "dd/LL/yyyy");
  const apiRoute = `${process.env.NEXT_PUBLIC_API_SERVICE_URL}/archive/${apiDateQuery}`;
  const res = await fetch(apiRoute);
  const data = (await res.json()) as ITrackResponse;

  return {
    props: {
      dateISO: params?.date as string,
      fallback: {
        [apiRoute]: data,
      },
    },
    revalidate: false,
  };
};
