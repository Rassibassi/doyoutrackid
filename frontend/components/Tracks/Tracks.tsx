import { format, parseISO } from "date-fns";
import { useContext } from "react";

import { TODAY_API_QUERY } from "../../constants/dates";
import { ActiveDate } from "../../contexts/activeDate";
import { ElevenEleven } from "../../contexts/elevenEleven";
import { useAPI } from "../../hooks/useAPI";
import { isElevenElevenBetween } from "../../utils";
import PlaceholderTrack from "../PlaceholderTrack/PlaceholderTrack";
import Track from "../Track/Track";

import styles from "./Tracks.module.scss";

interface ITracksProps {
  className?: string;
}

const Tracks = ({ className }: ITracksProps) => {
  const { setIsElevenEleven } = useContext(ElevenEleven);
  const activeDate = useContext(ActiveDate);
  const activeAPIDate = format(activeDate, "dd/LL/yyyy");
  const isToday = activeAPIDate === TODAY_API_QUERY;
  const apiRoute = isToday ? "/today" : `/archive/${activeAPIDate}`;

  // Will be provided with initial value from server (NextPages)
  // Refetch on mount - incase received out of date cached NextJS HTML / JSON
  // Only revalidate more than once if today. Other days will have static data
  const { tracks, isLoading } = useAPI(apiRoute, {
    focusThrottleInterval: 60000,
    revalidateIfStale: true,
    revalidateOnFocus: isToday,
    revalidateOnReconnect: isToday,
  });

  const rootStyles = [styles.root];
  if (className) rootStyles.push(className);

  return (
    <ul className={rootStyles.join(" ")}>
      {!!tracks?.length ? (
        tracks?.map(
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
                releaseDate={
                  release_date
                    ? format(parseISO(release_date.split(" ")[0]), "dd/LL/yyyy")
                    : "Unknown"
                }
                time={format(parseISO(played_datetime), "HH:mm")}
                title={title}
              />
              {tracks[i + 1] &&
                isElevenElevenBetween(
                  parseISO(tracks[i + 1].played_datetime),
                  parseISO(played_datetime)
                ) && (
                  <p className={styles.elevenEleven}>
                    <span
                      className={styles.btn}
                      onClick={() => setIsElevenEleven(true)}
                    >
                      11:11
                    </span>
                  </p>
                )}
            </li>
          )
        )
      ) : (
        <li className={styles.listItem}>
          <PlaceholderTrack isLoading={isLoading} />
        </li>
      )}
    </ul>
  );
};

export default Tracks;
