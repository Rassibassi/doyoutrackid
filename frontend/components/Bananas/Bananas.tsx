import Link from "next/link";

import { IRoute } from "../../constants/routes";
import Banana from "../../public/banana.webp";
import StickerArchive from "../../public/sticker_archive.webp";
import StickerToday from "../../public/sticker_today.webp";
import StickerDoYou from "../../public/sticker_do_you.webp";

import styles from "./Bananas.module.scss";

interface IBananasProps {
  className?: string;
  links?: IRoute[];
  shouldJiggle?: boolean;
}

const BANANAS = [
  {
    rotation: 0,
    stickerId: "archive",
    stickerTransform: "translate(110, 330) rotate(-40, 50, 50) scale(0.7)",
  },
  {
    rotation: 25,
    stickerId: "today",
    stickerTransform: "translate(110, 330) rotate(-30, 50, 50)",
  },
  {
    rotation: 50,
    stickerId: "doYou",
    stickerTransform: "translate(110, 330) rotate(-20, 50, 50)",
  },
];

const IMAGES = [
  {
    id: "banana",
    ...Banana,
  },
  {
    id: "archive",
    ...StickerArchive,
  },
  {
    id: "doYou",
    ...StickerDoYou,
  },
  {
    id: "today",
    ...StickerToday,
  },
];

const Bananas = ({ className, links = [], shouldJiggle }: IBananasProps) => {
  const rootStyles = [styles.root];
  if (className) rootStyles.push(className);
  if (shouldJiggle) rootStyles.push(styles.shouldJiggle);
  if (links.length) rootStyles.push(styles.shouldHover);

  return (
    <svg viewBox="0 0 750 650" className={rootStyles.join(" ")}>
      {BANANAS.map(({ rotation, stickerId, stickerTransform }, index) => {
        const link = links[index];
        const bananaMarkup = (
          <>
            <path d="M0 0h491v542H0z" className={styles.background} />
            <use xlinkHref="#banana" transform="translate(5, 5)" />
          </>
        );
        return (
          <g
            key={rotation}
            transform={`rotate(${rotation} 310 30) translate(250)`}
            className={styles.banana}
          >
            {link ? (
              <Link href={link.url} passHref>
                <a
                  target={link.url.pathname?.startsWith("http") ? "_blank" : ""}
                  rel="noreferrer"
                  className={[styles.link, styles[stickerId]].join(" ")}
                >
                  <text className={styles.label}>{link.label}</text>
                  {bananaMarkup}
                  <use
                    xlinkHref={`#${stickerId}`}
                    transform={stickerTransform}
                  />
                </a>
              </Link>
            ) : (
              bananaMarkup
            )}
          </g>
        );
      })}
      <defs>
        <clipPath id="bananaClip" x="0" y="0" width="491" height="543">
          <path
            d="m291 376 79 29 81 19 40 19v19l-22 30-44 31-82 19.5-91-5.5-99-45-74-60-52-86L0 245V138l17-76 18-44L58 0l21 6 18 56 32 112 31 66 57 80 74 56Z"
            fill="#5F82FF"
          />
        </clipPath>
        {IMAGES.map(({ width, src, height, id }) => (
          <image
            key={id}
            id={id}
            width={width}
            height={height}
            xlinkHref={src}
          />
        ))}
      </defs>
    </svg>
  );
};

export default Bananas;
