import { useCallback, useEffect, useRef, useState } from "react";

export enum SCROLL_DIRECTION {
  up = "up",
  down = "down",
  idle = "idle",
}

export function useScrollDirection() {
  const prevScrollPos = useRef<number>(0);
  const [direction, setDirection] = useState<SCROLL_DIRECTION>(
    SCROLL_DIRECTION.idle
  );

  const handleScroll = useCallback(() => {
    const currentScrollPos = window.pageYOffset;
    if (prevScrollPos.current > currentScrollPos) {
      setDirection(SCROLL_DIRECTION.up);
    } else {
      setDirection(SCROLL_DIRECTION.down);
    }
    prevScrollPos.current = currentScrollPos;
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return function cleanup() {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return direction;
}
