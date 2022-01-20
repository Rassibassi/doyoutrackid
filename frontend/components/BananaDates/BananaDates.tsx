import { format } from "date-fns";
import Link from "next/link";

import DateBanana from "../DateBanana/DateBanana";
import { ROUTE, ROUTES } from "../../constants/routes";

import styles from "./BananaDates.module.scss";

const ROTATION_DEGS = [15, 285, 360, 255, 315];
const ROTATION_ANI_DEGS = [20, 280, 355, 250, 320];
const ROTATION_DUR = [1.4, 1, 1.8, 1.5, 1.2];

interface IBananaDatesProps {
  dates: Date[];
  className?: string;
}

const BananaDates = ({ dates, className }: IBananaDatesProps) => {
  const rootStyles = [styles.root];
  if (className) rootStyles.push(className);

  const emptyStyles = [styles.empty];
  if (className) emptyStyles.push(className);

  return !dates.length ? (
    <p className={emptyStyles.join(" ")}>
      :(
      <br />
      There&apos;s nothing here
    </p>
  ) : (
    <ol className={rootStyles.join(" ")}>
      {dates.map((date, index) => (
        <li
          key={format(date, "dd-LL-yyyy")}
          className={styles.listItem}
          style={
            {
              "--rotation": ROTATION_DEGS[index % 5] + "deg",
              "--rotation-ani": ROTATION_ANI_DEGS[index % 5] + "deg",
              "--rotation-dur": ROTATION_DUR[index % 5] + "s",
            } as React.CSSProperties
          }
        >
          <Link
            href={`${ROUTES.get(ROUTE.tracks)?.url.pathname}/${format(
              date,
              "yyyy-LL-dd"
            )}`}
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
    </ol>
  );
};

export default BananaDates;
