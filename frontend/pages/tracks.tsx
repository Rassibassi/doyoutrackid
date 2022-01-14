import { UrlObject } from "url";

import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { format, parseISO } from "date-fns";
import Head from "next/head";

import Bananas from "../components/Bananas/Bananas";
import DateBanana from "../components/DateBanana/DateBanana";
import Tracks from "../components/Tracks/Tracks";
import { ROUTES, ROUTE } from "../constants/routes";
import styles from "../styles/tracks.module.scss";

const TracksPage: NextPage = () => {
  const { query, replace, isReady } = useRouter();
  const isValidQuery = !!query.date;
  const activeDate = parseISO(String(query.date));

  useEffect(() => {
    if (!isValidQuery && isReady) {
      replace(ROUTES.get(ROUTE.today)?.url as UrlObject, undefined, {
        shallow: true,
      });
    }
  }, [isValidQuery, isReady, replace]);

  return (
    <section className={styles.root}>
      <Head>
        <title>DO!! YOU!!! TRACK ID - Tracks {query?.date}</title>
      </Head>
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
