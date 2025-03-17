"use client";
import Menu, { MenuItem } from "@/app/components/Menu";
import { IconLink } from "@/sanity/types/types";
import { ThemeToggle } from "./ThemeToggle/ThemeToggle";
import { SocialIcons } from "./SocialIcons";
import Link from "next/link";
import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";

export default function useScrollPosition(
  scrollRef: React.RefObject<HTMLDivElement | null>,
  stickyRef: React.RefObject<HTMLDivElement | null>
) {
  const scrollPositionTrigger = useRef<number | null>(null);
  const [isStickyEnabled, setIsStickyEnabled] = useState(false);
  const ticking = useRef(false);
  const lastY = useRef(0);

  const handleMediaQueryChange = useCallback(
    (event: MediaQueryListEvent) => {
      setIsStickyEnabled(!event.matches);
      scrollRef.current?.classList.remove(
        "sticky",
        "sticky-show",
        "sticky-transition"
      );
    },
    [scrollRef]
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

  useEffect(() => {
    const mdQuery = window.matchMedia("(min-width: 48rem)");
    setIsStickyEnabled(!mdQuery.matches);

    // Initialize scroll position trigger
    if (scrollPositionTrigger.current === null && stickyRef.current) {
      scrollPositionTrigger.current =
        stickyRef.current.offsetTop + stickyRef.current.offsetHeight;
    }

    lastY.current = window.scrollY;

    // Event listeners
    mdQuery.addEventListener("change", handleMediaQueryChange);
    window.addEventListener("scroll", handleScroll);

    // Initial scroll check
    if (isStickyEnabled) {
      handleScroll();
    }

    // Cleanup
    return () => {
      mdQuery.removeEventListener("change", handleMediaQueryChange);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll, handleMediaQueryChange, isStickyEnabled, stickyRef]);

  return { isStickyEnabled };
}

export const Layout: React.FC<{
  children?: React.ReactNode;
  pageTitle: string;
  socialMedia: Array<IconLink>;
  authorName: string;
  menuItems: MenuItem[];
}> = ({ children, pageTitle, socialMedia, authorName, menuItems }) => {
  const navRef = React.useRef<HTMLDivElement>(null);
  const mainRef = React.useRef<HTMLDivElement>(null);

  useScrollPosition(mainRef, navRef);

  return (
    <div className="container mx-auto grid grid-cols-9 pt-6 md:pt-0">
      <div
        ref={mainRef}
        className="group peer relative top-[0px] z-20 col-span-9 flex flex-col justify-end md:sticky md:top-0 md:col-span-2 md:h-screen md:flex-row md:gap-4 md:px-6 md:py-0"
      >
        <Menu ref={navRef} menuItems={menuItems} />

        <header className="flex flex-col justify-between px-6 py-2 group-[.sticky]:-translate-y-full group-[.sticky]:bg-white group-[.sticky-show]:translate-y-0 group-[.sticky-show]:shadow-md group-[.sticky-transition]:transition-transform md:items-center md:bg-transparent md:px-0 md:py-6 dark:group-[.sticky]:bg-black dark:group-[.sticky-show]:shadow-[0px_2px_4px_-2px_rgba(0,0,0,0.8)]">
          <div className="order-2 flex justify-between md:block">
            <Link
              href={"/"}
              className="origin-bottom-right scale-100 text-lg font-bold transition-transform duration-100 hover:scale-105 md:mb-2 md:[writing-mode:vertical-lr]"
            >
              {authorName}
            </Link>
            <SocialIcons socialMedia={socialMedia} />
          </div>
          <div className="relative order-1 flex group-[.sticky]:translate-y-[-50px]">
            <ThemeToggle />
          </div>
        </header>
      </div>
      <main className="prose prose-xl dark:prose-invert relative col-span-9 max-w-fit px-6 pt-6 peer-[.sticky]:top-[24px] md:col-span-5 md:px-0 md:pt-24">
        <div className="flex h-full flex-col">
          <h1 className="relative text-5xl font-bold after:absolute after:right-0 after:-bottom-5 after:-left-10 after:h-px after:w-[100vw] after:bg-current md:mb-10 md:text-8xl md:after:-bottom-10 md:after:left-[-196px] after:dark:bg-white">
            {pageTitle}
          </h1>
          <div className="relative flex-1 pt-6 after:absolute after:top-0 after:right-0 after:bottom-0 after:left-[-196px] after:w-px after:bg-black md:pt-12 dark:after:bg-white">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
