import { useEffect, useRef } from "react";

interface UseScrollHeaderOptions {
  className?: string;
  shadowClassName?: string;
  offsetSelector?: string;
  mediaQueryMatch?: string;
}

export const useScrollPosition = (
  headerRef: React.RefObject<HTMLElement | null>,
  {
    className = "hide-menu",
    shadowClassName = "detached-menu",
    offsetSelector = "[data-scroll-anchor]",
    mediaQueryMatch = "(min-width: 48rem)",
  }: UseScrollHeaderOptions = {}
) => {
  const scrollDirection = useRef("");
  const lastY = useRef(0);
  const isPastOffset = useRef(false);
  const offset = useRef(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia(mediaQueryMatch);

    const onScroll = () => {
      if (!headerRef.current) return;

      const { scrollY } = window;

      isPastOffset.current = scrollY > offset.current;

      const isAtBottom =
        scrollY + window.innerHeight >= document.documentElement.scrollHeight;
      if (!isAtBottom) {
        scrollDirection.current = scrollY > lastY.current ? "down" : "up";
      }

      headerRef.current.classList.toggle(shadowClassName, scrollY > 0);
      headerRef.current.classList.toggle(
        className,
        isPastOffset.current && scrollDirection.current === "down"
      );

      lastY.current = scrollY;
    };

    const getOffset = () => {
      const offsetElement = headerRef.current?.querySelector(offsetSelector);
      if (!offsetElement) {
        console.warn(`No element found for selector "${offsetSelector}"`);
        return 0;
      }
      return offsetElement.getBoundingClientRect().height;
    };

    const enableScrollHandling = () => {
      offset.current = getOffset();
      window.addEventListener("scroll", onScroll, { passive: true });
    };

    const destroyScrollHandling = () => {
      window.removeEventListener("scroll", onScroll);
      headerRef.current?.classList.remove(className, shadowClassName);
    };

    const onMediaChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        destroyScrollHandling();
      } else {
        enableScrollHandling();
      }
    };

    if (!mediaQuery.matches) {
      enableScrollHandling();
    }

    mediaQuery.addEventListener("change", onMediaChange);

    return () => {
      mediaQuery.removeEventListener("change", onMediaChange);
      destroyScrollHandling();
    };
  }, [headerRef, className, offsetSelector, mediaQueryMatch, shadowClassName]);
};
