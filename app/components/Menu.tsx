"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
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

const Menu = () => {
  const path = usePathname();

  return (
    <nav className="py-4 flex flex-col text-4xl font-extralight absolute bottom-0">
      {menuItems.map((item, i) => (
        <Link
          className={`${path === item.pathname && "font-bold"}`}
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
