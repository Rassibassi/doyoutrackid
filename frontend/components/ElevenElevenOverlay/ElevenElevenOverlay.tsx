import { useContext, useEffect } from "react";

import { ElevenEleven } from "../../contexts/elevenEleven";

import styles from "./ElevenElevenOverlay.module.scss";

const VIDEO_SRC =
  "https://res.cloudinary.com/dmqr7syhe/video/upload/q_50/v1641607661/doyoutrackid/darude_sandstorm_20s_ufitbj.mp4";

const ElevenElevenOverlay = ({ className }: { className?: string }) => {
  const { setIsElevenEleven } = useContext(ElevenEleven);

  useEffect(() => {
    document?.querySelector("body")?.classList.add("noScroll");
    return () => document?.querySelector("body")?.classList.remove("noScroll");
  });

  const rootStyles = [styles.root];
  if (className) rootStyles.push(className);

  return (
    <div
      className={rootStyles.join(" ")}
      onClick={() => setIsElevenEleven(false)}
    >
      <video
        loop
        src={VIDEO_SRC}
        autoPlay
        muted
        playsInline
        className={styles.top}
      />
      <video
        playsInline
        loop
        src={VIDEO_SRC}
        autoPlay
        muted
        className={styles.bottom}
      />
      <video
        playsInline
        loop
        src={VIDEO_SRC}
        autoPlay
        muted
        className={styles.left}
      />
      <video
        playsInline
        loop
        src={VIDEO_SRC}
        autoPlay
        muted
        className={styles.middle}
      />
      <p className={styles.elevens}>
        11
        <br />
        11
        <br />
        11
        <br />
        11
        <br />
        11
        <br />
        11
        <br />
        11
        <br />
        11
        <br />
        11
        <br />
        11
        <br />
        11
        <br />
        11
        <br />
        11
        <br />
      </p>
    </div>
  );
};

export default ElevenElevenOverlay;
