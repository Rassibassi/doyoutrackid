import { NextPage } from "next";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

import PillCta from "../components/PillCta/PillCta";
import { ARCHIVE, ARCHIVE_YEARS, TODAY } from "../constants/dates";
import DateBanana from "../components/DateBanana/DateBanana";
import { ROUTE_HREF } from "../constants/routes";
import { EPolyAs } from "../components/PolyCta/PolyCta";
import styles from "../styles/archive.module.scss";

const ROTATION_DEGS = [285, 315, 360, 15];

const Archive: NextPage = () => {
  const {
    query: { month, year },
    isReady,
    replace,
  } = useRouter();

  const isValidQuery = month && year;
  const monthQuery = String(month);
  const yearQuery = String(year);

  useEffect(() => {
    if (!isValidQuery && isReady) {
      replace(
        {
          pathname: `/${ROUTE_HREF.archive}`,
          query: {
            month: format(TODAY, "LLLL"),
            year: format(TODAY, "yyyy"),
          },
        },
        undefined,
        { shallow: true }
      );
    }
  }, [isValidQuery, isReady, replace]);

  return (
    <div className={styles.root}>
      <nav className={styles.nav}>
        {isValidQuery &&
          ARCHIVE_YEARS.map((year) => (
            <div key={year.year}>
              <h2 className={styles.year}>{year.year}</h2>
              <ul className={styles.navList}>
                {Array.from(year.months.values())
                  .reverse()
                  .map((month) => (
                    <li key={month.month} className={styles.navItem}>
                      <Link
                        href={{
                          pathname: `/${ROUTE_HREF.archive}`,
                          query: {
                            year: `${year.year}`,
                            month: `${month.month}`,
                          },
                        }}
                        passHref
                      >
                        <PillCta
                          className={styles.pill}
                          isActive={
                            year.year === yearQuery &&
                            month.month === monthQuery
                          }
                          as={EPolyAs.anchor}
                        >
                          {month.month}
                        </PillCta>
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
      </nav>
      <ul className={styles.bananaList}>
        {isValidQuery &&
          ARCHIVE.get(yearQuery)
            ?.months.get(monthQuery)
            ?.days.reverse()
            .map((day) => (
              <li
                key={format(day, "dd-LL-yyyy")}
                className={styles.bananaListItem}
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
                    query: { date: format(day, "yyyy-LL-dd") },
                  }}
                  passHref
                >
                  <a className={styles.bananaLink}>
                    <DateBanana
                      className={styles.banana}
                      date={format(day, "dd/LL/yyyy")}
                      day={format(day, "EEE")}
                    />
                  </a>
                </Link>
              </li>
            ))}
      </ul>
    </div>
  );
};

export default Archive;
