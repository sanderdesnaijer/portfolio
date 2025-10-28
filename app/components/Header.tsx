"use client";
import Link from "next/link";
import { AUTHOR_NAME } from "../utils/constants";
import Menu, { MenuItem } from "./Menu";
import { ThemeToggle } from "./ThemeToggle/ThemeToggle";
import SiteLogo from "@/app/assets/logo.svg";
import { useRef } from "react";
import { useScrollPosition } from "../utils/useScrollPosition";

export const Header = ({ menuItems }: { menuItems: MenuItem[] }) => {
  const stickyRef = useRef<HTMLDivElement>(null);

  useScrollPosition(stickyRef);
  return (
    <header
      ref={stickyRef}
      className="group sticky top-[0px] z-20 col-span-9 flex flex-col justify-end md:top-0 md:col-span-3 md:h-screen md:flex-row md:gap-4 md:px-6 md:py-0 xl:col-span-2"
    >
      <Menu menuItems={menuItems} />
      <div className="flex -translate-y-0 flex-col justify-between bg-white px-6 py-1 transition-all group-[.detached-menu]:shadow-sm group-[.hide-menu]:-translate-y-full md:translate-y-0 md:items-center md:overflow-visible md:bg-transparent md:px-0 md:py-6 md:shadow-none md:transition-none dark:bg-black dark:shadow-black dark:md:bg-transparent">
        <div className="z-1 order-2 flex flex-col justify-between md:flex md:items-center">
          <Link
            href={"/"}
            className="group link flex h-8 origin-bottom-right items-center text-lg font-bold underline-offset-2 hover:underline md:mb-2 md:h-auto md:[writing-mode:vertical-lr] [&>svg]:mr-3 [&>svg]:transition-transform [&>svg]:duration-75 hover:[&>svg]:scale-110 md:[&>svg]:mr-0 md:[&>svg]:mb-2"
          >
            <SiteLogo className="h-8 [--logoBgColor:black] [--logoDisplay:none] [--logoShapeColor:white] dark:[--logoBgColor:white] dark:[--logoShapeColor:black]" />
            {AUTHOR_NAME}
          </Link>
        </div>
        <div className="relative z-2 order-1 flex md:top-0 [&>button]:-top-1">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
