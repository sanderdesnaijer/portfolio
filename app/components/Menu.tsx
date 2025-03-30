"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export type MenuItem = {
  pathname: string;
  title: string;
};

const Menu = React.forwardRef<
  HTMLDivElement,
  { className?: string; menuItems: MenuItem[] }
>(
  (
    {
      className = "fixed bottom-0 order-2 flex w-full min-w-[172px] border-none bg-white px-6 font-extralight shadow-[-1px_-1px_3px_0_rgba(0,0,0,0.1),_-1px_-1px_2px_-1px_rgba(0,0,0,0.1)] md:flex-col md:justify-end md:py-6 md:text-4xl dark:bg-black dark:shadow-black",
      menuItems,
    },
    ref
  ) => {
    const path = usePathname();
    const t = useTranslations();

    const isActive = (item: MenuItem) => {
      const { pathname } = item;
      if (path === undefined || pathname === undefined) {
        return false;
      }
      return (
        pathname === path || (pathname !== "/" && path.startsWith(pathname))
      );
    };

    return (
      <nav
        data-sticky
        aria-label={t("generic.mainNavigation")}
        ref={ref}
        className={
          "fixed bottom-0 order-2 flex w-full min-w-[172px] border-none bg-white px-6 font-extralight shadow-[-1px_-1px_3px_0_rgba(0,0,0,0.1),_-1px_-1px_2px_-1px_rgba(0,0,0,0.1)] md:sticky md:flex-col md:justify-end md:bg-transparent md:py-6 md:text-4xl md:shadow-none dark:bg-black dark:shadow-black"
        }
      >
        <ul className="flex w-full md:absolute md:block">
          {menuItems.map((item, i) => (
            <li key={i} className="flex w-1/4">
              <Link
                className={`${isActive(item) ? "font-bold" : ""} block w-full translate-x-0 p-3 text-center transition-transform hover:font-bold hover:italic active:font-bold md:mr-auto md:p-0 md:hover:translate-x-2 lg:mr-2`}
                href={item.pathname}
                {...(isActive(item) && {
                  ["aria-current"]: "page",
                })}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    );
  }
);
Menu.displayName = "Menu";

export default Menu;
