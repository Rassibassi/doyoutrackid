import type { NextPage } from "next";
import Head from "next/head";

import Navbar from "../Navbar/Navbar";

import styles from "./Layout.module.scss";

const Layout: NextPage = ({ children }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>DO!! YOU!!! TRACKID!!!!</title>
      </Head>

      <header className={styles.header}>
        <Navbar className={styles.navbar} />
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <p>Erin Rimmer X jackhkmatthews</p>
      </footer>
    </div>
  );
};

export default Layout;
