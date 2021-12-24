import { NextPage } from "next";

import Bananas from "../components/Bananas/Bananas";
import { BANANA_NAV_LINKS } from "../constants/routes";
import styles from "../styles/index.module.scss";

const Home: NextPage = () => {
  return (
    <div className={styles.root}>
      <Bananas
        className={styles.bananaNav}
        links={BANANA_NAV_LINKS}
        shouldJiggle
      />
    </div>
  );
};

export default Home;
