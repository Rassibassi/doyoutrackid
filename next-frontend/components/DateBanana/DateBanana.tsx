import Image from "next/image";
import { useState } from "react";

import {
  BANANA_IMAGES,
  BANANA_NAME,
  IBananaImage,
} from "../../constants/bananas";

import styles from "./DateBanana.module.scss";

interface IDateBananaProps {
  className?: string;
  date: string;
  day: string;
}

const BANANA = BANANA_IMAGES.get(BANANA_NAME.short) as IBananaImage;

const DateBanana = ({ className, date, day }: IDateBananaProps) => {
  const [hasLoaded, setHasLoaded] = useState(false);

  const rootStyles = [styles.root];
  if (className) rootStyles.push(className);
  if (hasLoaded) rootStyles.push(styles.hasLoaded);

  return (
    <div className={rootStyles.join(" ")}>
      <Image
        className={styles.banana}
        width={BANANA.width}
        height={BANANA.height}
        src={BANANA.src}
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
