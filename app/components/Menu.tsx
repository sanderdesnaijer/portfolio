"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export type MenuItem = {
  pathname: string;
  title: string;
};

// position: fixed;
// bottom: 0;
// width: 100%;
// background: red;
// left: 0;
// right: 0;
// justify-content: space-evenly;
// padding: 20px 20px 40px;
// font-size: 22px;

const Menu = React.forwardRef<
  HTMLElement,
  { className?: string; menuItems: MenuItem[] }
>(
  (
    {
      className = "order-2 border-none group-[.sticky]:bg-white dark:group-[.sticky]:bg-black  group-[.sticky]:text-2xl group-[.sticky]:place-content-evenly group-[.sticky]:py-8 group-[.sticky]:bottom-0 group-[.sticky]:left-0 group-[.sticky]:right-0 group-[.sticky]:fixed flex min-w-[172px] font-extralight before:absolute before:right-[-100px] before:left-[-100px] before:h-[24px] md:flex-col md:justify-end md:pl-4 md:text-4xl",
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
      <nav ref={ref} aria-label="page-navigation" className={className}>
        {menuItems.map((item, i) => (
          <Link
            className={`${isActive(item) ? "font-bold" : ""} translate-x-0 transition hover:font-bold hover:italic md:mr-2 md:mr-auto md:hover:translate-x-2`}
            key={i}
            href={item.pathname}
          >
            {item.title}
          </Link>
        ))}
      </nav>
    );
  }
);
Menu.displayName = "Menu"; // Required for forwardRef components

export default Menu;
