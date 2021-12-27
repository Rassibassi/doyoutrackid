import { parseISO, format } from "date-fns";

import Track from "../Track/Track";
import { useAPI } from "../../hooks/useAPI";

import styles from "./Tracks.module.scss";

const TODAY_QUERY = "today";

interface ITracksProps {
  className?: string;
  dateQuery: string;
}

const Tracks = ({ className, dateQuery }: ITracksProps) => {
  const isToday = dateQuery === TODAY_QUERY;
  const { tracks } = useAPI(isToday ? TODAY_QUERY : `archive/${dateQuery}`);

  const rootStyles = [styles.root];
  if (className) rootStyles.push(className);

  return (
    <ul className={rootStyles.join(" ")}>
      {tracks &&
        tracks.map(
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
    </ul>
  );
};

export default Tracks;
