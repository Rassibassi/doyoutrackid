import Head from "next/head";
import { format } from "date-fns";
import { useContext } from "react";

import Bananas from "../../components/Bananas/Bananas";
import Tracks from "../../components/Tracks/Tracks";
import DateBanana from "../../components/DateBanana/DateBanana";
import { ActiveDate } from "../../contexts/activeDate";

import styles from "./TracksScreen.module.scss";

const TracksScreen = () => {
  const date = useContext(ActiveDate);

  return (
    <section className={styles.root}>
      <Head>
        <title>
          DO!! YOU!!! TRACK ID - Tracks {format(date, "yyyy-LL-dd")}
        </title>
      </Head>
      <Bananas className={styles.bananas} />
      <Tracks className={styles.list} />
      <DateBanana
        className={styles.banana}
        date={format(date, "dd/LL/yyyy")}
        day={format(date, "EEE")}
      />
    </section>
  );
};

export default TracksScreen;
