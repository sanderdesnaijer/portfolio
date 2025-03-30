"use client";
import Menu, { MenuItem } from "@/app/components/Menu";
import { IconLink } from "@/sanity/types/types";
import { ThemeToggle } from "./ThemeToggle/ThemeToggle";
import { SocialIcons } from "./SocialIcons";
import Link from "next/link";
import React from "react";
import useScrollPosition from "../utils/useScrollPosition";

export const Layout: React.FC<{
  children?: React.ReactNode;
  pageTitle: string;
  socialMedia: Array<IconLink>;
  authorName: string;
  menuItems: MenuItem[];
}> = ({ children, pageTitle, socialMedia, authorName, menuItems }) => {
  const stickyRef = React.useRef<HTMLDivElement>(null);

  useScrollPosition(stickyRef);

  return (
    <div className="mx-auto grid grid-cols-9 pt-0 md:container">
      <div
        ref={stickyRef}
        className="group peer sticky top-[0px] z-20 col-span-9 flex flex-col justify-end md:top-0 md:col-span-3 md:h-screen md:flex-row md:gap-4 md:px-6 md:py-0 xl:col-span-2"
      >
        <Menu menuItems={menuItems} />
        <header className="flex flex-col justify-between bg-white px-6 py-2 transition-all group-[.custom-has-scrolled]:shadow-sm group-[.custom-sticky]:-translate-y-full group-[.custom-sticky-show]:-translate-y-0 md:translate-y-0 md:items-center md:overflow-visible md:bg-transparent md:px-0 md:py-6 md:shadow-none dark:bg-black dark:shadow-black dark:md:bg-transparent">
          <div className="z-1 order-2 flex justify-between md:block">
            <Link
              href={"/"}
              className="origin-bottom-right scale-100 text-lg font-bold transition-transform duration-100 hover:scale-105 md:mb-2 md:[writing-mode:vertical-lr]"
            >
              {authorName}
            </Link>
            <SocialIcons socialMedia={socialMedia} />
          </div>
          <div className="relative z-2 order-1 flex">
            <ThemeToggle />
          </div>
        </header>
      </div>
      <main className="prose prose-xl dark:prose-invert relative col-span-9 max-w-fit px-6 pt-6 pb-12 md:col-span-6 md:px-0 md:pt-24 md:pb-0 lg:col-span-5">
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
