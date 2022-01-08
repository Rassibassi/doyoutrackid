import Link from "next/link";

import { IRoute } from "../../constants/routes";

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
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className={styles.img}
                      alt="Banana!"
                      srcSet="https://res.cloudinary.com/dmqr7syhe/f_auto,c_limit,w_640,q_auto/v1640127156/doyoutrackid/banana_short_l5wtkg.png 1x, https://res.cloudinary.com/dmqr7syhe/f_auto,c_limit,w_1080,q_auto/v1640127156/doyoutrackid/banana_short_l5wtkg.png 2x"
                      src="https://res.cloudinary.com/dmqr7syhe/f_auto,c_limit,w_1080,q_auto/v1640127156/doyoutrackid/banana_short_l5wtkg.png"
                      decoding="async"
                      data-nimg="intrinsic"
                    />
                    <span className={styles.label}>{link.label}</span>
                  </a>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default Bananas;
