import axios from "axios";
import moment from "moment";
import type { NextPage } from "next";
import { useEffect, useRef, useState } from "react";

import Track from "../components/Track/Track";
import { ITrack, ITrackResponse } from "../constants/tracks";
import styles from "../styles/today.module.scss";

const Today: NextPage = () => {
  const [tracks, setTracks] = useState<ITrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const getTrackIds = (timeoutMs: number) => {
    setIsLoading(true);
    axios
      .get<ITrackResponse>(`${process.env.NEXT_PUBLIC_API_SERVICE_URL}/today`)
      .then((res) => {
        const tracks = res.data.tracks;

        // some delay to avoid spamming clicks on the refresh button
        timeoutRef.current = setTimeout(() => {
          setTracks(tracks);
          setIsLoading(false);
          timeoutRef.current = undefined;
        }, timeoutMs);
      })
      .catch((err) => {
        console.log(err);

        timeoutRef.current = setTimeout(() => {
          setIsLoading(false);
          timeoutRef.current = undefined;
        }, timeoutMs);
      });
  };

  useEffect(() => {
    getTrackIds(200);
    return () => {
      if (timeoutRef.current !== undefined) {
        // handle memory leak
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const rootStyles = [styles.root];
  if (isLoading) rootStyles.push(styles.isLoading);

  return (
    <section className={rootStyles.join(" ")}>
      {/* <button
        className={isLoading ? " is-loading" : ""}
        onClick={() => {
          getTrackIds(1000);
        }}
      >
        Refresh
      </button> */}
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
    </section>
  );
};

export default Today;
