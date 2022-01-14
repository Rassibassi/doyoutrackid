import { PADDED_BANANA_SRC } from "../../constants/bananas";

interface IClippedBananaProps {
  className?: string;
}

const ClippedBanana = ({ className }: IClippedBananaProps) => {
  const rootStyles = [];
  if (className) rootStyles.push(className);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={rootStyles.join(" ")}
      alt="Banana!"
      src={PADDED_BANANA_SRC}
      decoding="async"
      data-nimg="intrinsic"
    />
  );
};

export default ClippedBanana;
