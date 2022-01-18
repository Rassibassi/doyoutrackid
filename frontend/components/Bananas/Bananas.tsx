import Link from "next/link";
import Image from "next/image";

import { IRoute, ISticker } from "../../constants/routes";
import ShortBanana from "../ShortBanana/PaddedBanana";

import styles from "./Bananas.module.scss";

interface IBananasProps {
  className?: string;
  links?: IRoute[];
  shouldJiggle?: boolean;
}

const BANANAS = new Array(3).fill("");

const Bananas = ({ className, links = [], shouldJiggle }: IBananasProps) => {
  const rootStyles = [styles.root];
  if (className) rootStyles.push(className);
  if (shouldJiggle) rootStyles.push(styles.shouldJiggle);
  if (links.length) rootStyles.push(styles.shouldHover);

  return (
    <div className={rootStyles.join(" ")}>
      <ul className={styles.list}>
        {BANANAS.map((_, index) => {
          const link = links[index];
          return (
            <li key={index} className={styles.item}>
              {link ? (
                <Link href={link.url} passHref>
                  <a
                    target={
                      link.url.pathname?.startsWith("http") ? "_blank" : ""
                    }
                    rel="noreferrer"
                    className={styles.bananaWrapper}
                  >
                    <ShortBanana className={styles.banana} />
                    <div className={styles.sticker}>
                      <Image
                        layout="responsive"
                        {...(link.sticker as ISticker)}
                        alt={link.label}
                      />
                    </div>
                    <span className={styles.label}>{link.label}</span>
                  </a>
                </Link>
              ) : (
                <div className={styles.bananaWrapper}>
                  <ShortBanana className={styles.banana} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Bananas;
