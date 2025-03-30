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
      className = "order-2  flex min-w-[172px] border-none px-6 md:py-6 font-extralight md:flex-col md:justify-end  md:text-4xl",
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
        className={className}
      >
        <ul className="flex w-full md:absolute md:block">
          {menuItems.map((item, i) => (
            <li key={i} className="flex">
              <Link
                className={`${isActive(item) ? "font-bold" : ""} mr-2 block w-full translate-x-0 transition-transform hover:font-bold hover:italic active:font-bold md:mr-auto md:hover:translate-x-2`}
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
