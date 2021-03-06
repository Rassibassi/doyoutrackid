import Banana from "../../public/banana_no_blur.webp";

import styles from "./BananaFace.module.scss";

interface IBananaFaceProps {
  className?: string;
}

const BananaFace = ({ className }: IBananaFaceProps) => {
  const rootStyles = [];
  if (className) rootStyles.push(className);

  return (
    <svg viewBox="0 0 700 550" className={rootStyles.join(" ")}>
      <image
        transform="translate(100, 200) rotate(130, 236, 264)"
        id="banana"
        width={Banana.width}
        height={Banana.height}
        xlinkHref={Banana.src}
      />
      <circle className={styles.eye} cx="200" cy="20" r="20" />
      <circle className={styles.eye} cx="500" cy="20" r="20" />
    </svg>
  );
};

export default BananaFace;
