import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Head from "next/head";

import { ARCHIVE, TODAY_MONTH, TODAY_YEAR } from "../constants/dates";
import { ROUTE, ROUTES } from "../constants/routes";
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
          ...ROUTES.get(ROUTE.archive)?.url,
          query: {
            month: TODAY_MONTH.toLocaleLowerCase(),
            year: TODAY_YEAR,
          },
        },
        undefined,
        { shallow: true }
      );
    }
  }, [isValidQuery, isReady, replace]);

  return (
    <div className={styles.root}>
      <Head>
        <title>DO!! YOU!!! TRACK ID - Archive</title>
      </Head>
      <div className={styles.nav}>
        <MonthNav
          className={styles.navInner}
          activeMonth={activeMonth}
          activeYear={activeYear}
        />
      </div>
      {isValidQuery && (
        <BananaDates
          dates={ARCHIVE.get(activeYear)?.months.get(activeMonth)?.days || []}
          className={styles.bananaDates}
        />
      )}
    </div>
  );
};

export default Archive;
