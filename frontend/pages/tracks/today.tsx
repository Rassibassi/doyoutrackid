import { GetStaticProps, NextPage } from "next";
import { SWRConfig } from "swr";

import { ITrackResponse } from "../../constants/tracks";
import TracksScreen from "../../components/TracksScreen/TracksScreen";
import { ActiveDate } from "../../contexts/activeDate";
import { TODAY } from "../../constants/dates";

interface ITracksPageProps {
  fallback: {
    [key: string]: ITrackResponse;
  };
}

const TracksPage: NextPage<ITracksPageProps> = ({ fallback }) => {
  return (
    <ActiveDate.Provider value={TODAY}>
      <SWRConfig value={{ fallback }}>
        <TracksScreen />
      </SWRConfig>
    </ActiveDate.Provider>
  );
};

export default TracksPage;

export const getStaticProps: GetStaticProps<ITracksPageProps> = async () => {
  const apiRoute = `${process.env.NEXT_PUBLIC_API_SERVICE_URL}/today`;
  const res = await fetch(apiRoute);
  const data = (await res.json()) as ITrackResponse;

  return {
    props: {
      fallback: {
        [apiRoute]: data,
      },
    },
    revalidate: 60,
  };
};
