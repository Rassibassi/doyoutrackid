import { parseISO, format } from "date-fns";
import { useContext } from "react";

import Track from "../Track/Track";
import { useAPI } from "../../hooks/useAPI";
import { ITrack } from "../../constants/tracks";
import { TODAY_API_QUERY } from "../../constants/dates";
import { ElevenEleven } from "../../contexts/elevenEleven";
import PlaceholderTrack from "../PlaceholderTrack/PlaceholderTrack";
import { isElevenElevenBetween } from "../../utils";

import styles from "./Tracks.module.scss";

interface ITracksProps {
  className?: string;
  dateQuery: string;
}

const Tracks = ({ className, dateQuery }: ITracksProps) => {
  const isToday = dateQuery === TODAY_API_QUERY;
  const { tracks, isLoading, error } = useAPI(`archive/${dateQuery}`);
  const { setIsElevenEleven } = useContext(ElevenEleven);

  const orderedTracks = isToday
    ? tracks?.reduce((a, b) => [b].concat(a), [] as ITrack[])
    : tracks;

  const rootStyles = [styles.root];
  if (className) rootStyles.push(className);

  return (
    <ul className={rootStyles.join(" ")}>
      {!!tracks?.length &&
        !isLoading &&
        !error &&
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
        )}
      {(!tracks?.length || error || isLoading) && (
        <li className={styles.listItem}>
          <PlaceholderTrack isLoading={isLoading} />
        </li>
      )}
    </ul>
  );
};

export default Tracks;
