"use client";
import Menu, { MenuItem } from "@/app/components/Menu";
import { IconLink } from "@/sanity/types/types";
import { ThemeToggle } from "./ThemeToggle/ThemeToggle";
import { SocialIcons } from "./SocialIcons";
import Link from "next/link";
import React from "react";

export default function useScrollPosition(
  scrollRef: React.RefObject<HTMLDivElement | null>,
  stickyRef: React.RefObject<HTMLDivElement | null>
) {
  const scrollPositionTrigger = React.useRef<number>(null);
  React.useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    if (scrollPositionTrigger.current === null && stickyRef.current !== null) {
      scrollPositionTrigger.current =
        (stickyRef.current?.offsetTop || 0) +
        (stickyRef.current?.offsetHeight || 0);
    }

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentY = window.scrollY;
          const navTop = scrollPositionTrigger.current || 0;

          const isSticky = navTop - currentY <= 0;
          const direction = currentY > lastY ? "down" : "up";

          console.log(
            isSticky,
            scrollPositionTrigger.current,
            navTop,
            currentY
          );

          const shouldStick = direction === "up" && isSticky;

          if (shouldStick) {
            scrollRef.current?.classList.add("sticky");
            // stickyRef.current?.classList.add("-translate-y-6");
          } else {
            scrollRef.current?.classList.remove("sticky");
            // stickyRef.current?.classList.remove("-translate-y-6");
          }

          lastY = currentY;
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollRef, stickyRef]);
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
        className="group peer relative top-[0px] z-20 col-span-9 flex flex-col justify-end overflow-hidden bg-white p-6 pt-0 pb-0 md:sticky md:top-0 md:col-span-2 md:h-screen md:flex-row md:gap-4 md:overflow-visible md:bg-transparent md:pb-6 dark:bg-black dark:md:bg-transparent"
      >
        <div className="flex flex-col justify-between py-2 before:absolute before:top-[0px] before:right-[-100px] before:left-[-100px] before:h-full before:bg-white md:items-center md:py-0 md:before:bg-transparent dark:before:bg-black dark:group-[.sticky]:before:shadow-[0px_3px_15px_rgba(0,0,0,0.8)] dark:md:before:bg-transparent">
          <nav
            aria-label="author-navigation"
            className="order-2 flex justify-between md:block"
          >
            <Link
              href={"/"}
              className="origin-bottom-right scale-100 text-lg font-bold transition-transform duration-100 hover:scale-105 md:mb-2 md:[writing-mode:vertical-lr]"
            >
              {authorName}
            </Link>
            <SocialIcons socialMedia={socialMedia} />
          </nav>
          <div className="relative order-1 flex group-[.sticky]:translate-y-[-50px]">
            <ThemeToggle />
          </div>
        </div>
        <Menu ref={navRef} menuItems={menuItems} />
      </div>
      <main className="prose prose-xl dark:prose-invert relative col-span-9 max-w-fit px-6 pt-6 peer-[.sticky]:top-[24px] peer-[.sticky]:pb-28 md:col-span-5 md:px-0 md:pt-24">
        <div className="flex h-full flex-col">
          <h1 className="relative text-5xl font-bold after:absolute after:right-0 after:-bottom-5 after:-left-10 after:h-px after:w-[100vw] after:bg-current md:mb-10 md:text-8xl md:after:-bottom-10 md:after:left-[-196px] after:dark:bg-white">
            {pageTitle}
          </h1>
          <div className="relative flex-1 pt-6 pb-12 after:absolute after:top-0 after:right-0 after:bottom-0 after:left-[-196px] after:w-px after:bg-black md:pt-12 dark:after:bg-white">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
