import { GetStaticProps, GetStaticPaths, NextPage } from "next";
import { format, isAfter, isBefore, parseISO } from "date-fns";
import { SWRConfig } from "swr";

import { ITrackResponse } from "../../constants/tracks";
import TracksScreen from "../../components/TracksScreen/TracksScreen";
import { ActiveDate } from "../../contexts/activeDate";

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
      <SWRConfig value={{ fallback }}>
        <TracksScreen />
      </SWRConfig>
    </ActiveDate.Provider>
  );
};

export default TracksPage;

// Dates in past of build date (static data) handled by pages/tracks/[date].tsx
// Day of request (dynamic data) handled by pages/tracks/today.tsx
// Dates in future of build and not date of request (dynamic data) handled here
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [{ params: { dates: [] } }],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<ITracksPageProps> = async ({
  params,
}) => {
  const todayDate = parseISO(format(new Date(), "yyyy-LL-dd"));

  const dateParams = (params?.dates as string[]) || [];

  // Will be 'Invalid Date' if malformed ISO provided
  const requestedDate = parseISO(dateParams[0]) as string | Date;

  // Return 404 if not tracks/:date
  // Return 404 if ISO string malformed
  // No revalidation as always want to return 404
  if (
    dateParams.length !== 1 ||
    requestedDate == "Invalid Date" ||
    typeof requestedDate === "string"
  ) {
    return {
      notFound: true,
      revalidate: false,
    };
  }

  // Future dates should return 404
  // But, at some point, 'future' dates will be 'past' dates
  // So these 'future' dates should continue to revalidate
  if (isAfter(requestedDate, todayDate)) {
    return {
      notFound: true,
      revalidate: 60,
    };
  }

  const apiDateQuery = format(requestedDate, "dd/LL/yyyy");
  const apiRoute = `${process.env.NEXT_PUBLIC_API_SERVICE_URL}/archive/${apiDateQuery}`;
  const res = await fetch(apiRoute);
  const data = (await res.json()) as ITrackResponse;

  return {
    props: {
      fallback: {
        [apiRoute]: data,
      },
      dateISO: dateParams[0],
    },
    // If requested date is in the past (isBefore === true), send the above data but don't revalidate
    // as track data will never change
    revalidate: isBefore(requestedDate, todayDate) ? false : 60,
  };
};
