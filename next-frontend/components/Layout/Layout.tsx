import type { NextPage } from "next";
import Head from "next/head";
import { useRef, useContext } from "react";

import { ElevenEleven } from "../../contexts/elevenEleven";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import {
  SCROLL_DIRECTION,
  useScrollDirection,
} from "../../hooks/useScrollDirection";
import ElevenElevenOverlay from "../ElevenElevenOverlay/ElevenElevenOverlay";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";

import styles from "./Layout.module.scss";

const Layout: NextPage = ({ children }) => {
  const headerRef = useRef<HTMLElement>(null);
  const { isElevenEleven } = useContext(ElevenEleven);
  const scrollDirection = useScrollDirection();
  const entry = useIntersectionObserver(null, "0px", 1, headerRef.current);
  const navStyles = [styles.nav];
  if (
    scrollDirection === SCROLL_DIRECTION.down &&
    entry?.intersectionRatio !== 1 &&
    entry?.isIntersecting === false
  ) {
    navStyles.push(styles.hide);
  }

  const rootStyles = [styles.root];
  if (isElevenEleven) rootStyles.push(styles.isElevenEleven);

  return (
    <div className={rootStyles.join(" ")}>
      <Head>
        <title>DO!! YOU!!! TRACK ID</title>
      </Head>

      <header className={styles.header} ref={headerRef}>
        <Navbar className={navStyles.join(" ")} />
      </header>

      <main className={styles.main}>{children}</main>

      <Footer className={styles.footer} />

      {isElevenEleven && (
        <ElevenElevenOverlay className={styles.elevenEleven} />
      )}
    </div>
  );
};

export default Layout;
