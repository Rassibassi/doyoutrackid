import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import {
  BANANA_IMAGES,
  BANANA_NAME,
  IBananaImage,
} from "../../constants/bananas";
import { IRoute } from "../../constants/routes";

import styles from "./Bananas.module.scss";

interface IBananasProps {
  className?: string;
  links?: IRoute[];
  shouldJiggle?: boolean;
}

const BANANA = BANANA_IMAGES.get(BANANA_NAME.short) as IBananaImage;

const BANANAS = new Array(3).fill("");

const Bananas = ({ className, links = [], shouldJiggle }: IBananasProps) => {
  const [hasLoaded, setHasLoaded] = useState(false);

  const rootStyles = [styles.root];
  if (className) rootStyles.push(className);
  if (hasLoaded) rootStyles.push(styles.hasLoaded);
  if (shouldJiggle) rootStyles.push(styles.shouldJiggle);

  return (
    <div className={rootStyles.join(" ")}>
      <ol className={styles.list}>
        {BANANAS.map((_, index) => {
          const link = links[index];
          return (
            <li key={index} className={styles.item}>
              {link && (
                <Link href={link.url} passHref>
                  <a
                    target={
                      link.url.pathname?.startsWith("http") ? "_blank" : ""
                    }
                    rel="noreferrer"
                    className={styles.anchor}
                  >
                    {link.label}
                  </a>
                </Link>
              )}
              <Image
                width={BANANA.width}
                height={BANANA.height}
                src={BANANA.src}
                priority
                onLoadingComplete={() => setHasLoaded(true)}
                alt="Banana!"
              />
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default Bananas;
