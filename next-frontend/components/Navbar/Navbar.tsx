import Link from "next/link";

import { NAV_BAR_LINKS, ROUTES, ROUTE_HREF } from "../../constants/routes";
import NavItem from "../NavItem/NavItem";

import styles from "./Navbar.module.scss";

interface INavbarProps {
  className?: string;
}

const Navbar = ({ className }: INavbarProps) => {
  const rootStyles = [styles.root];
  if (className) rootStyles.push(className);
  return (
    <div className={rootStyles.join(" ")}>
      <Link href={ROUTES.get(ROUTE_HREF.home)?.href as string} passHref>
        <a>
          <h1 className={styles.title}>
            Do!! You!!!<span className={styles.trackId}> Track ID!!!!</span>
          </h1>
        </a>
      </Link>
      <nav className={styles.nav}>
        {NAV_BAR_LINKS.map(({ href, label }) => (
          <Link href={href} passHref key={href}>
            <NavItem>{label}</NavItem>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Navbar;
