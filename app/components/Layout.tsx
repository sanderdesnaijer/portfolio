"use client";
import Menu, { MenuItem } from "@/app/components/Menu";
import { IconLink } from "@/sanity/types/types";
import { ThemeToggle } from "./ThemeToggle/ThemeToggle";
import { SocialIcons } from "./SocialIcons";
import Link from "next/link";
import React from "react";
import useScrollPosition from "../utils/useScrollPosition";
import SiteLogo from "../../public/logo.svg";

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
        <header className="flex flex-col justify-between bg-white px-6 py-1 transition-all group-[.custom-has-scrolled]:shadow-sm group-[.custom-sticky]:-translate-y-full group-[.custom-sticky-show]:-translate-y-0 md:translate-y-0 md:items-center md:overflow-visible md:bg-transparent md:px-0 md:py-6 md:shadow-none dark:bg-black dark:shadow-black dark:md:bg-transparent">
          <div className="z-1 order-2 flex flex-col justify-between md:flex md:items-center">
            <Link
              href={"/"}
              className="flex h-8 origin-bottom-right scale-100 items-center text-lg font-bold transition-transform duration-100 hover:scale-105 md:mb-2 md:h-auto md:[writing-mode:vertical-lr] [&>svg]:mr-3 md:[&>svg]:mr-0 md:[&>svg]:mb-2"
            >
              <SiteLogo className="h-8 [--logoBgColor:black] [--logoDisplay:none] [--logoShapeColor:white] dark:[--logoBgColor:white] dark:[--logoShapeColor:black]" />
              {authorName}
            </Link>
            <SocialIcons socialMedia={socialMedia} />
          </div>
          <div className="relative z-2 order-1 flex md:top-0 [&>button]:top-1">
            <ThemeToggle />
          </div>
        </header>
      </div>
      <main className="prose prose-xl dark:prose-invert relative col-span-9 max-w-fit px-6 pb-12 md:col-span-6 md:px-0 md:pt-6 md:pb-0 lg:col-span-5">
        <div className="flex h-full flex-col">
          <h1 className="relative text-5xl font-bold after:absolute after:right-0 after:-bottom-5 after:-left-10 after:h-px after:w-[100vw] after:bg-current md:my-10 md:text-8xl md:after:-bottom-10 md:after:left-[-196px] after:dark:bg-white">
            {pageTitle}
          </h1>
          <div className="relative flex-1 after:absolute after:top-0 after:right-0 after:bottom-0 after:left-[-196px] after:w-px after:bg-black md:pt-0 dark:after:bg-white">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
