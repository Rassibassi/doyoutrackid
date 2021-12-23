import { NextPage } from "next";

import BananaNav from "../components/BananaNav/BananaNav";
import styles from "../styles/index.module.scss";

const Home: NextPage = () => {
  return (
    <div className={styles.root}>
      <BananaNav className={styles.bananaNav} />
    </div>
  );
};

export default Home;
