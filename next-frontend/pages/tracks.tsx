import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { format, parseISO } from "date-fns";

import Bananas from "../components/Bananas/Bananas";
import DateBanana from "../components/DateBanana/DateBanana";
import Tracks from "../components/Tracks/Tracks";
import { TODAY } from "../constants/dates";
import { ROUTE_HREF } from "../constants/routes";
import styles from "../styles/tracks.module.scss";

const TracksPage: NextPage = () => {
  const { query, replace, isReady } = useRouter();
  const isValidQuery = !!query.date;
  const activeDate = parseISO(String(query.date));

  useEffect(() => {
    if (!isValidQuery && isReady) {
      replace(
        {
          pathname: `/${ROUTE_HREF.tracks}`,
          query: {
            date: format(TODAY, "yyyy-LL-dd"),
          },
        },
        undefined,
        { shallow: true }
      );
    }
  }, [isValidQuery, isReady, replace]);

  return (
    <section className={styles.root}>
      <Bananas className={styles.bananas} />
      {isValidQuery && (
        <>
          <Tracks
            dateQuery={format(activeDate, "dd/LL/yyyy")}
            className={styles.list}
          />
          <DateBanana
            className={styles.banana}
            date={format(activeDate, "dd/LL/yyyy")}
            day={format(activeDate, "EEE")}
          />
        </>
      )}
    </section>
  );
};

export default TracksPage;
