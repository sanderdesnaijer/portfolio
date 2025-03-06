import { IconLink } from "@/sanity/types/types";
import { getIcon } from "./Icons";
import Link from "next/link";
import { getChevronClasses } from "../utils/tailwind";

export const LinkList: React.FC<{ links: Array<IconLink> }> = ({ links }) => {
  return (
    <ul className="group relative z-1 m-0 list-none p-0">
      {links.map((link) => {
        const IconComponent = getIcon(link.icon);
        return (
          <li
            key={link.title}
            aria-label={`${link.icon} icon`}
            title={link.icon}
            className="group/item mt-4 mb-4 items-center p-0 transition-transform"
          >
            <Link
              className="flex w-full no-underline underline-offset-4 group-hover/item:underline"
              href={link.link}
              target="_blank"
            >
              <IconComponent className="mr-3 transition-transform group-hover/item:scale-110" />
              <span
                className={`mt-0 mb-0 text-base font-normal ${getChevronClasses()} after:mt-0.5 after:h-5 after:w-5`}
              >
                {link.title}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
