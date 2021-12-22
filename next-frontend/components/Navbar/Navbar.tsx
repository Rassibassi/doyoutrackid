import Link from "next/link";

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
      <Link href="/" passHref>
        <a>
          <h1 className={styles.title}>
            Do!! You!!!<span className={styles.trackId}> Track ID!!!!</span>
          </h1>
        </a>
      </Link>
      <nav className={styles.nav}>
        <Link href="/live" passHref>
          <NavItem>Live</NavItem>
        </Link>
        <Link href="/archive" passHref>
          <NavItem>Archive</NavItem>
        </Link>
      </nav>
    </div>
  );
};

export default Navbar;
