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
  className = "flex flex-col text-4xl font-extralight justify-end min-w-[172px] pl-4",
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
    <nav className={className}>
      {menuItems.map((item, i) => (
        <Link
          className={isActive(item) ? "font-bold" : ""}
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
