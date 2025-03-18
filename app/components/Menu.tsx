"use client";

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
      className = "order-2 group-[.sticky]:translate-y-full group-[.sticky-show]:translate-y-0 group-[.sticky-transition]:transition-transform flex min-w-[172px] border-none px-6 md:py-6 group-[.sticky]:px-0 font-extralight group-[.sticky]:fixed group-[.sticky]:right-0 group-[.sticky]:bottom-0 group-[.sticky]:left-0 group-[.sticky]:place-content-evenly group-[.sticky]:bg-white group-[.sticky]:py-0 group-[.sticky]:text-2xl group-[.sticky]:shadow-[0_-4px_6px_-1px_var(--tw-shadow-color,rgb(0_0_0_/_0.1))] md:flex-col md:justify-end md:pl-4 md:text-4xl dark:group-[.sticky]:bg-black dark:group-[.sticky]:shadow-[0px_-2px_4px_-2px_rgba(0,0,0,0.8)]",
      menuItems,
    },
    ref
  ) => {
    const path = usePathname();

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
        aria-label="Main navigation"
        ref={ref}
        className={className}
      >
        <ul className="flex w-full md:absolute md:block">
          {menuItems.map((item, i) => (
            <li key={i} className="flex group-[.sticky]:w-1/4">
              <Link
                className={`${isActive(item) ? "font-bold" : ""} mr-2 block w-full translate-x-0 transition-transform group-[.sticky]:mr-0 group-[.sticky]:pt-4 group-[.sticky]:pb-6 group-[.sticky]:text-center hover:font-bold hover:italic active:font-bold md:mr-auto md:hover:translate-x-2`}
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
