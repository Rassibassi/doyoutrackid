import Link from "next/link";

import PillCta from "../PillCta/PillCta";
import { ARCHIVE_YEARS } from "../../constants/dates";
import { EPolyAs } from "../PolyCta/PolyCta";
import { ROUTE, ROUTES } from "../../constants/routes";

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
              <li key={month.path} className={styles.navItem}>
                <Link
                  href={{
                    ...ROUTES.get(ROUTE.archive)?.url,
                    query: {
                      year: `${year.year}`,
                      month: `${month.path}`,
                    },
                  }}
                  passHref
                >
                  <PillCta
                    className={styles.pill}
                    isActive={
                      year.year === activeYear && month.path === activeMonth
                    }
                    as={EPolyAs.anchor}
                  >
                    {month.label}
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
