import Head from "next/head";
import { format } from "date-fns";
import { useContext } from "react";

import { TODAY_ISO } from "../../constants/dates";
import Bananas from "../../components/Bananas/Bananas";
import Tracks from "../../components/Tracks/Tracks";
import DateBanana from "../../components/DateBanana/DateBanana";
import { ActiveDate } from "../../contexts/activeDate";

import styles from "./TracksScreen.module.scss";

const TracksScreen = () => {
  const activeDate = useContext(ActiveDate);
  const activeISO = format(activeDate, "yyyy-LL-dd");
  const isToday = activeISO === TODAY_ISO;

  return (
    <section className={styles.root}>
      <Head>
        <title>
          DO!! YOU!!! TRACK ID - Tracks {isToday ? "today" : activeISO}
        </title>
      </Head>
      <Bananas className={styles.bananas} />
      <Tracks className={styles.list} />
      <DateBanana
        className={styles.banana}
        date={format(activeDate, "dd/LL/yyyy")}
        day={format(activeDate, "EEE")}
      />
    </section>
  );
};

export default TracksScreen;
