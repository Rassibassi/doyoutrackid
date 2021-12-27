import { NextPage } from "next";
import { format } from "date-fns";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { ARCHIVE, TODAY } from "../constants/dates";
import { ROUTE_HREF } from "../constants/routes";
import styles from "../styles/archive.module.scss";
import MonthNav from "../components/MonthNav/MonthNav";
import BananaDates from "../components/BananaDates/BananaDates";

const Archive: NextPage = () => {
  const {
    query: { month, year },
    isReady,
    replace,
  } = useRouter();
  const isValidQuery = month && year;
  const activeMonth = String(month);
  const activeYear = String(year);

  // useRouter.query returns {} on first render
  // only true values once isReady === true
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

  return isValidQuery ? (
    <div className={styles.root}>
      <MonthNav
        className={styles.nav}
        activeMonth={activeMonth}
        activeYear={activeYear}
      />
      <BananaDates
        dates={ARCHIVE.get(activeYear)?.months.get(activeMonth)?.days || []}
        className={styles.bananaDates}
      />
    </div>
  ) : null;
};

export default Archive;
