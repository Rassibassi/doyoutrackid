import { parseISO, format } from "date-fns";

import Track from "../Track/Track";
import { useAPI } from "../../hooks/useAPI";
import { ITrack } from "../../constants/tracks";
import { TODAY, TODAY_API_QUERY } from "../../constants/dates";

import styles from "./Tracks.module.scss";

interface ITracksProps {
  className?: string;
  dateQuery: string;
}

const Tracks = ({ className, dateQuery }: ITracksProps) => {
  const isToday = dateQuery === TODAY_API_QUERY;
  const { tracks, isLoading, error } = useAPI(`archive/${dateQuery}`);

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
            </li>
          )
        )}
      {(!tracks?.length || error) && !isLoading && (
        <li className={styles.listItem}>
          <p className={styles.time}>{format(TODAY, "HH:mm")}</p>
          <p className={styles.empty}>
            :(
            <br />
            There&apos;s nothing here
          </p>
        </li>
      )}
      {isLoading && (
        <li className={styles.listItem}>
          <p className={styles.time}>{format(TODAY, "HH:mm")}</p>
          <p className={styles.empty}>
            :D
            <br />
            Loading...
          </p>
        </li>
      )}
    </ul>
  );
};

export default Tracks;
