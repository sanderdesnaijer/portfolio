import { useState, useRef, useCallback, useEffect } from "react";

/**
 * Custom hook to manage sticky positioning based on scroll behavior.
 * @param mainRef - Reference to the main container that should contain an element with [data-sticky].
 *                  Example:
 *                  ```tsx
 *                  <div ref={mainRef}>
 *                    <div data-sticky>Sticky Element</div>
 *                  </div>
 *                  ```
 * @returns Object containing sticky state information.
 * @warning The provided `mainRef` must contain an element with `[data-sticky]`, otherwise the hook will not function properly.
 */
export default function useScrollPosition(
  ref: React.RefObject<HTMLDivElement | null>
) {
  const scrollPositionTrigger = useRef<number | null>(null);
  const [isStickyEnabled, setIsStickyEnabled] = useState(false);
  const ticking = useRef(false);
  const lastY = useRef(0);

  const removeClasses = useCallback(() => {
    ref.current?.classList.remove(
      "custom-has-scrolled",
      "custom-sticky",
      "custom-sticky-show"
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addClasses = useCallback(
    (currentY: number, offsetTop: number) => {
      const classList = ref.current?.classList;
      const isSticky = offsetTop - currentY <= 0;
      const direction = currentY > lastY.current ? "down" : "up";

      classList?.toggle("custom-has-scrolled", currentY > 0);

      if (isSticky) {
        classList?.add("custom-sticky");
        classList?.toggle("custom-sticky-show", direction === "up");
      } else {
        classList?.remove("custom-sticky", "custom-sticky-show");
      }
    },
    [ref]
  );

  const registerScrollPositionTrigger = useCallback(() => {
    if (scrollPositionTrigger.current === null && ref.current) {
      // Find element 'data-sticky' (or another selector)
      const stickyElement = ref.current.querySelector(
        "[data-sticky]"
      ) as HTMLElement;
      if (stickyElement) {
        const { height } = stickyElement.getBoundingClientRect();
        scrollPositionTrigger.current = height * 2;
      } else {
        // eslint-disable-next-line no-console
        console.warn(
          "useScrollPosition: No element with [data-sticky] found inside the provided ref."
        );
      }
    }
  }, [ref]);

  const handleMediaQueryChange = useCallback(
    (event: MediaQueryListEvent) => {
      const shouldEnableSticky = !event.matches;
      setIsStickyEnabled(shouldEnableSticky);

      if (shouldEnableSticky) {
        registerScrollPositionTrigger();
      }

      removeClasses();
    },
    [removeClasses, registerScrollPositionTrigger]
  );

  const processScroll = useCallback(() => {
    const currentY = window.scrollY;
    const offsetTop = scrollPositionTrigger.current ?? 0;
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;

    if (currentY >= maxScroll) {
      lastY.current = maxScroll;
      ticking.current = false;
      return;
    }

    addClasses(currentY, offsetTop);
    lastY.current = currentY;
    ticking.current = false;
  }, [addClasses]);

  const handleScroll = useCallback(() => {
    if (!ticking.current && isStickyEnabled) {
      ticking.current = true;
      requestAnimationFrame(processScroll);
    }
  }, [isStickyEnabled, processScroll]);

  useEffect(() => {
    const mdQuery = window.matchMedia("(min-width: 48rem)");
    const shouldEnableSticky = !mdQuery.matches;
    setIsStickyEnabled(shouldEnableSticky);

    if (shouldEnableSticky) {
      registerScrollPositionTrigger();
      handleScroll();
    }

    lastY.current = window.scrollY;

    mdQuery.addEventListener("change", handleMediaQueryChange);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      mdQuery.removeEventListener("change", handleMediaQueryChange);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll, handleMediaQueryChange, registerScrollPositionTrigger]);

  return { isStickyEnabled };
}
