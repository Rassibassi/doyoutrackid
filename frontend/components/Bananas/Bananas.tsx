import Link from "next/link";

import { IRoute } from "../../constants/routes";
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
      <ol className={styles.list}>
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
                    <ShortBanana className={styles.img} />
                    <span className={styles.label}>{link.label}</span>
                  </a>
                </Link>
              ) : (
                <div className={styles.bananaWrapper}>
                  <ShortBanana className={styles.img} />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default Bananas;
