import "normalize.css";
import "../styles/globals.scss";
import * as NextImage from "next/image";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

const OriginalNextImage = NextImage.default;

function normalizeSrc(src) {
  return src[0] === "/" ? src.slice(1) : src;
}

// TODO(jack.matthews): figure out how to get images in storybook
function cloudinaryLoader({ root, src, width, quality }) {
  // Demo: https://res.cloudinary.com/demo/image/upload/w_300,c_limit,q_auto/turtles.jpg
  const params = [
    "f_auto",
    "c_limit",
    "w_" + width,
    "q_" + (quality || "auto"),
  ];
  const paramsString = params.join(",") + "/";
  return `${root}${paramsString}${normalizeSrc(src)}`;
}

Object.defineProperty(NextImage, "default", {
  configurable: true,
  value: ({ src, width, quality, ...rest }) => {
    return (
      <OriginalNextImage
        src={cloudinaryLoader({
          root: "https://res.cloudinary.com/dmqr7syhe/",
          src,
          width,
          quality,
        })}
        width={width}
        {...rest}
        unoptimized
      />
    );
  },
});
