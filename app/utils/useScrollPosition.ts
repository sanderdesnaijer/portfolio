import { useState, useRef, useCallback, useLayoutEffect } from "react";

/**
 * Custom hook to manage sticky positioning based on scroll behavior
 * @param scrollRef - Reference to the scrollable container
 * @param stickyRef - Reference to the element that should become sticky
 * @returns Object containing sticky state information
 */
export default function useScrollPosition(
  scrollRef: React.RefObject<HTMLDivElement | null>,
  stickyRef: React.RefObject<HTMLDivElement | null>
) {
  const scrollPositionTrigger = useRef<number | null>(null);
  const [isStickyEnabled, setIsStickyEnabled] = useState(false);
  const ticking = useRef(false);
  const lastY = useRef(0);

  const registerScrollPositionTrigger = useCallback(() => {
    if (scrollPositionTrigger.current === null && stickyRef.current) {
      scrollPositionTrigger.current =
        stickyRef.current.offsetTop + stickyRef.current.offsetHeight;
    }
  }, [stickyRef]);

  const handleMediaQueryChange = useCallback(
    (event: MediaQueryListEvent) => {
      const shouldEnableSticky = !event.matches;
      setIsStickyEnabled(shouldEnableSticky);

      if (shouldEnableSticky) {
        registerScrollPositionTrigger();
      }

      scrollRef.current?.classList.remove(
        "sticky",
        "sticky-show",
        "sticky-transition"
      );
    },
    [registerScrollPositionTrigger, scrollRef]
  );

  const handleScroll = useCallback(() => {
    if (!ticking.current && isStickyEnabled) {
      ticking.current = true;
      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const offsetTop = scrollPositionTrigger.current ?? 0;
        const maxScroll =
          document.documentElement.scrollHeight - window.innerHeight;

        // Don't do anything when the bottom of the page is reached
        if (currentY >= maxScroll) {
          lastY.current = maxScroll;
          ticking.current = false;
          return;
        }

        const isSticky = offsetTop - currentY <= 0;
        const direction = currentY > lastY.current ? "down" : "up";
        const classList = scrollRef.current?.classList;

        if (isSticky) {
          classList?.add("sticky");
          // Add transition with a delay to not prevent flickering
          requestAnimationFrame(() => {
            classList?.add("sticky-transition");
            if (direction === "up") {
              classList?.add("sticky-show");
            } else {
              classList?.remove("sticky-show");
            }
          });
        } else {
          classList?.remove("sticky", "sticky-show", "sticky-transition");
        }

        lastY.current = currentY;
        ticking.current = false;
      });
    }
  }, [isStickyEnabled, scrollRef]);

  useLayoutEffect(() => {
    const mdQuery = window.matchMedia("(min-width: 48rem)");
    const shouldEnableSticky = !mdQuery.matches;
    setIsStickyEnabled(shouldEnableSticky);

    // Initialize scroll position trigger
    if (shouldEnableSticky) {
      registerScrollPositionTrigger();
      handleScroll();
    }

    lastY.current = window.scrollY;

    // Event listeners
    mdQuery.addEventListener("change", handleMediaQueryChange);
    window.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => {
      mdQuery.removeEventListener("change", handleMediaQueryChange);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll, handleMediaQueryChange, registerScrollPositionTrigger]);

  return { isStickyEnabled };
}
