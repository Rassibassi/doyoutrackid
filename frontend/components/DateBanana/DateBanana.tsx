import Image from "next/image";
import { useState } from "react";

import Banana from "../../public/banana.webp";

import styles from "./DateBanana.module.scss";

interface IDateBananaProps {
  className?: string;
  date: string;
  day: string;
}

const DateBanana = ({ className, date, day }: IDateBananaProps) => {
  const [hasLoaded, setHasLoaded] = useState(false);

  const rootStyles = [styles.root];
  if (className) rootStyles.push(className);
  if (hasLoaded) rootStyles.push(styles.hasLoaded);

  return (
    <div className={rootStyles.join(" ")}>
      <Image
        className={styles.banana}
        src={Banana}
        priority
        onLoadingComplete={() => setHasLoaded(true)}
        alt="Banana!"
      />
      <p className={styles.day}>{day}</p>
      <p className={styles.date}>{date}</p>
    </div>
  );
};

export default DateBanana;
