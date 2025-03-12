"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type MenuItem = {
  pathname: string;
  title: string;
};

const Menu = ({
  className = "flex md:flex-col md:text-4xl font-extralight md:justify-end min-w-[172px] md:pl-4 order-2",
  menuItems,
}: {
  className?: string;
  menuItems: MenuItem[];
}) => {
  const path = usePathname();
  const isActive = (item: MenuItem) => {
    const { pathname } = item;
    if (path === undefined || pathname === undefined) {
      return false;
    }
    return pathname === path || (pathname !== "/" && path.startsWith(pathname));
  };

  return (
    <nav aria-label="page-navigation" className={className}>
      {menuItems.map((item, i) => (
        <Link
          className={`${isActive(item) ? "font-bold" : ""} mr-2 translate-x-0 transition hover:font-bold hover:italic md:mr-auto md:hover:translate-x-2`}
          key={i}
          href={item.pathname}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
};

export default Menu;
