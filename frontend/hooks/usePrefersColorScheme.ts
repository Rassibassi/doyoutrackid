import { useEffect, useState } from "react";

export enum COLOR_SCHEME {
  light = "light",
  dark = "dark",
  noPreference = "no-preference",
}

const query = (mode: COLOR_SCHEME) => `(prefers-color-scheme: ${mode})`;

function getDarkQuery() {
  return window.matchMedia?.(query(COLOR_SCHEME.dark));
}
function getLightQuery() {
  return window.matchMedia?.(query(COLOR_SCHEME.light));
}

export function usePrefersColorScheme() {
  const [preferredColorSchema, setPreferredColorSchema] =
    useState<COLOR_SCHEME>(COLOR_SCHEME.noPreference);

  useEffect(() => {
    const isDark = getDarkQuery()?.matches;
    const isLight = getLightQuery()?.matches;
    if (isDark) setPreferredColorSchema(COLOR_SCHEME.dark);
    else if (isLight) setPreferredColorSchema(COLOR_SCHEME.light);
    else setPreferredColorSchema(COLOR_SCHEME.noPreference);
  }, []);

  useEffect(() => {
    const darkQuery = getDarkQuery();
    const lightQuery = getLightQuery();
    if (typeof darkQuery.addEventListener === "function") {
      const darkListener = ({ matches }: MediaQueryListEvent) =>
        matches && setPreferredColorSchema(COLOR_SCHEME.dark);
      const lightListener = ({ matches }: MediaQueryListEvent) =>
        matches && setPreferredColorSchema(COLOR_SCHEME.light);

      darkQuery.addEventListener("change", darkListener);
      lightQuery.addEventListener("change", lightListener);

      return () => {
        darkQuery.removeEventListener("change", darkListener);
        lightQuery.removeEventListener("change", lightListener);
      };
    } else {
      // In some early implementations MediaQueryList existed, but did not
      // subclass EventTarget

      // Closing over isDark here would cause it to not update when
      // `darkQuery.matches` changes
      const listener = () =>
        setPreferredColorSchema(
          darkQuery.matches
            ? COLOR_SCHEME.dark
            : lightQuery.matches
            ? COLOR_SCHEME.light
            : COLOR_SCHEME.noPreference
        );

      // This is two state updates if a user changes from dark to light, but
      // both state updates will be consistent and should be batched by React,
      // resulting in only one re-render
      darkQuery.addListener(listener);
      lightQuery.addListener(listener);

      return () => {
        darkQuery.removeListener(listener);
        lightQuery.removeListener(listener);
      };
    }
  }, []);

  return preferredColorSchema;
}
