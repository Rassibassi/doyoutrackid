import Link from "next/link";

import PillCta from "../PillCta/PillCta";
import { ARCHIVE_YEARS } from "../../constants/dates";
import { ROUTE_HREF } from "../../constants/routes";
import { EPolyAs } from "../PolyCta/PolyCta";

import styles from "./MonthNav.module.scss";

interface IMonthNavProps {
  activeMonth: string;
  activeYear: string;
  className?: string;
}

const MonthNav = ({ activeMonth, activeYear, className }: IMonthNavProps) => {
  const rootStyles = [styles.root];
  if (className) rootStyles.push(className);

  return (
    <nav className={rootStyles.join(" ")}>
      {ARCHIVE_YEARS.map((year) => (
        <div key={year.year} className={styles.nav}>
          <h2 className={styles.year}>{year.year}</h2>
          <ul className={styles.navList}>
            {Array.from(year.months.values()).map((month) => (
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
                      year.year === activeYear && month.month === activeMonth
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
  );
};

export default MonthNav;
