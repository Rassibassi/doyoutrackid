import { format } from "date-fns";
import Link from "next/link";

import DateBanana from "../DateBanana/DateBanana";
import { ROUTE_HREF } from "../../constants/routes";

import styles from "./BananaDates.module.scss";

const ROTATION_DEGS = [285, 315, 360, 15];

interface IBananaDatesProps {
  dates: Date[];
  className?: string;
}

const BananaDates = ({ dates, className }: IBananaDatesProps) => {
  const rootStyles = [styles.root];
  if (className) rootStyles.push(className);

  return (
    <ul className={rootStyles.join(" ")}>
      {dates.map((date) => (
        <li
          key={format(date, "dd-LL-yyyy")}
          className={styles.listItem}
          style={
            {
              "--rotation":
                ROTATION_DEGS[
                  Math.floor(Math.random() * ROTATION_DEGS.length)
                ] + "deg",
            } as React.CSSProperties
          }
        >
          <Link
            href={{
              pathname: ROUTE_HREF.tracks,
              query: { date: format(date, "yyyy-LL-dd") },
            }}
            passHref
          >
            <a className={styles.link}>
              <DateBanana
                date={format(date, "dd/LL/yyyy")}
                day={format(date, "EEE")}
              />
            </a>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default BananaDates;
