import { format, parseISO } from "date-fns";
import { useContext } from "react";

import { TODAY_API_QUERY } from "../../constants/dates";
import { ITrack } from "../../constants/tracks";
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
  const date = useContext(ActiveDate);
  const { setIsElevenEleven } = useContext(ElevenEleven);
  const apiDateQuery = format(date, "dd/LL/yyyy");
  const isToday = apiDateQuery === TODAY_API_QUERY;

  // Will be provided with initial value from server (NextPages)
  // Don't refetch data unless today
  // Other track data handled server-side
  const { tracks, isLoading } = useAPI(`/archive/${apiDateQuery}`, {
    focusThrottleInterval: 60000,
    revalidateIfStale: isToday,
    revalidateOnFocus: isToday,
    revalidateOnReconnect: isToday,
  });

  const orderedTracks = isToday
    ? tracks?.reduce((a, b) => [b].concat(a), [] as ITrack[])
    : tracks;

  const rootStyles = [styles.root];
  if (className) rootStyles.push(className);

  return (
    <ul className={rootStyles.join(" ")}>
      {!!tracks?.length ? (
        orderedTracks?.map(
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
              {orderedTracks[i + 1] &&
                isElevenElevenBetween(
                  parseISO(orderedTracks[i + 1].played_datetime),
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
