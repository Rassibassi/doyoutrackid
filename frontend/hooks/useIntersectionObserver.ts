import { useCallback, useEffect, useState } from "react";

export function useIntersectionObserver(
  root: Element | Document | null,
  rootMargin: string,
  threshold: number,
  target: Element | null
) {
  const [entry, setEntry] = useState<IntersectionObserverEntry>();

  const intersectionHandler = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      setEntry(entries[0]);
    },
    []
  );

  useEffect(() => {
    const options = {
      root,
      rootMargin,
      threshold,
    };
    const observer = new IntersectionObserver(intersectionHandler, options);
    if (target) observer.observe(target);
  }, [root, rootMargin, threshold, intersectionHandler, target]);

  return entry;
}
