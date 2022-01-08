import { format } from "date-fns";

import { TODAY } from "../../constants/dates";

import styles from "./PlaceholderTrack.module.scss";

interface ITracksProps {
  isLoading: boolean;
}

const PlaceholderTrack = ({ isLoading }: ITracksProps) => {
  return (
    <>
      <p className={styles.time}>{format(TODAY, "HH:mm")}</p>
      <p className={styles.copy}>
        {isLoading ? (
          <>
            :D
            <br />
            Loading...
          </>
        ) : (
          <>
            :(
            <br />
            There&apos;s nothing here
          </>
        )}
      </p>
    </>
  );
};

export default PlaceholderTrack;
