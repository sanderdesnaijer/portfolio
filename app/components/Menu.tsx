"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type MenuItem = {
  pathname: string;
  name: string;
};

const menuItems: MenuItem[] = [
  {
    pathname: "/",
    name: "Home",
  },
  {
    pathname: "/about",
    name: "About",
  },
  {
    pathname: "/projects",
    name: "Projects",
  },
  {
    pathname: "/blog",
    name: "Blog",
  },
];

const Menu = ({
  className = "flex md:flex-col md:text-4xl font-extralight md:justify-end min-w-[172px] md:pl-4 order-2",
}: {
  className?: string;
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
          className={`${isActive(item) ? "font-bold" : ""} mr-2 hover:font-bold hover:italic md:mr-auto`}
          key={i}
          href={item.pathname}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
};

export default Menu;
