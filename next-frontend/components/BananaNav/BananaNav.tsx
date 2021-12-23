import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import styles from "./BananaNav.module.scss";

interface IBananaNavProps {
  className?: string;
}

const LINKS = [
  {
    href: "https://doyou.world/",
    label: "Listen",
    src: "v1640127156/doyoutrackid/banana_short_l5wtkg.png",
    width: 472,
    height: 528,
    placeholder:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8uJz9PwAG0AKg4NkmbAAAAABJRU5ErkJggg==",
  },
  {
    href: "/live",
    label: "Live",
    src: "v1640127156/doyoutrackid/banana_short_l5wtkg.png",
    width: 472,
    height: 528,
    placeholder:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8d8fvPwAIMQMpuipP4wAAAABJRU5ErkJggg==",
  },
  {
    href: "/archive",
    label: "Archive",
    src: "v1640127156/doyoutrackid/banana_short_l5wtkg.png",
    width: 472,
    height: 528,
    placeholder:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8fc76PwAH1QMFwf1p9gAAAABJRU5ErkJggg==",
  },
];

const BananaNav = ({ className }: IBananaNavProps) => {
  const rootStyles = [styles.root];
  const [hasLoaded, setHasLoaded] = useState(false);
  if (className) rootStyles.push(className);
  if (hasLoaded) rootStyles.push(styles.hasLoaded);

  return (
    <div className={rootStyles.join(" ")}>
      <nav className={styles.nav}>
        <ol className={styles.list}>
          {LINKS.map(({ href, label, src, width, height, placeholder }) => (
            <li key={href} className={styles.item}>
              <Link href={href} passHref>
                <a className={styles.anchor}>{label}</a>
              </Link>
              <Image
                width={width}
                height={height}
                src={src}
                priority={true}
                onLoadingComplete={() => setHasLoaded(true)}
                placeholder="blur"
                blurDataURL={placeholder}
                alt="Banana!"
              />
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default BananaNav;
