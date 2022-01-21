export enum BANANA_NAME {
  short = "short",
}

export interface IBananaImage {
  src: string;
  height: number;
  width: number;
}

export const BANANA_IMAGES = new Map<BANANA_NAME, IBananaImage>([
  [
    BANANA_NAME.short,
    {
      src: "v1640127156/doyoutrackid/banana_gtye3j.png",
      width: 472,
      height: 528,
    },
  ],
]);

export const PADDED_BANANA_SRC =
  "https://res.cloudinary.com/dmqr7syhe/image/upload/c_mpad,g_south_west,h_600,w_700/v1640256804/doyoutrackid/banana_gtye3j.webp";

export enum SHADE {
  light = "light",
  medium = "medium",
  dark = "dark",
}

export const YELLOW_URIS = new Map<SHADE, string>([
  [
    SHADE.light,
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8uJz9PwAG0AKg4NkmbAAAAABJRU5ErkJggg==",
  ],
  [
    SHADE.medium,
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8d8fvPwAIMQMpuipP4wAAAABJRU5ErkJggg==",
  ],
  [
    SHADE.dark,
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8fc76PwAH1QMFwf1p9gAAAABJRU5ErkJggg==",
  ],
]);
