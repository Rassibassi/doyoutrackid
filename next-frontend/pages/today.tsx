import moment from "moment";
import type { NextPage } from "next";

import Bananas from "../components/Bananas/Bananas";
import DateBanana from "../components/DateBanana/DateBanana";
import Track from "../components/Track/Track";
import { useAPI } from "../hooks/useAPI";
import styles from "../styles/today.module.scss";

const Today: NextPage = () => {
  const { tracks } = useAPI("today");

  const today = new Date();

  return (
    <section className={styles.root}>
      <Bananas className={styles.bananas} />
      {tracks && (
        <ul className={styles.list}>
          {tracks.map(
            (
              {
                played_datetime,
                album,
                label,
                title,
                artist,
                song_link,
                release_date,
              },
              i
            ) => (
              <li key={i} className={styles.listItem}>
                <Track
                  album={album}
                  artist={artist}
                  label={label}
                  listenHref={song_link}
                  releaseDate={moment(release_date).format("DD/MM/YYYY")}
                  time={moment(played_datetime).format("HH:mm")}
                  title={title}
                />
              </li>
            )
          )}
        </ul>
      )}
      <DateBanana
        className={styles.banana}
        date={moment(today).format("DD/MM/YYYY")}
        day={moment(today).format("ddd")}
      />
    </section>
  );
};

export default Today;
