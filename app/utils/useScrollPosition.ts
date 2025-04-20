import { useEffect } from "react";

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
  useEffect(() => {
    const element = headerRef.current;
    if (!element) return;

    const offsetElement = element.querySelector(offsetSelector);
    if (!offsetElement) {
      // eslint-disable-next-line no-console
      console.warn(`No element found for selector "${offsetSelector}"`);
    }

    const offset = offsetElement?.getBoundingClientRect().height || 0;
    const mediaQuery = window.matchMedia(mediaQueryMatch);

    let direction = "";
    let lastY: number | null = null;
    let isPastOffset = false;
    let isDisabled = mediaQuery.matches;

    const onScroll = () => {
      if (isDisabled) return;

      const { scrollY } = window;

      isPastOffset = scrollY > offset;

      const isAtBottom =
        scrollY + window.innerHeight >= document.documentElement.scrollHeight;

      if (!isAtBottom && lastY !== null) {
        direction = scrollY > lastY ? "down" : "up";
      }
      element.classList.toggle(shadowClassName, scrollY > 0);
      element.classList.toggle(className, isPastOffset && direction === "down");

      lastY = scrollY;
    };

    const onMediaChange = (event: MediaQueryListEvent) => {
      isDisabled = event.matches;
      if (event.matches) {
        element.classList.remove(className, shadowClassName);
      }
    };

    mediaQuery.addEventListener("change", onMediaChange);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      mediaQuery.removeEventListener("change", onMediaChange);
      element.classList.remove(className, shadowClassName);
    };
  }, [headerRef, className, offsetSelector, mediaQueryMatch, shadowClassName]);
};
