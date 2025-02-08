import { IconLink } from "@/sanity/types/types";
import { getIcon } from "./Icons";
import Link from "next/link";

export const LinkList: React.FC<{ links: Array<IconLink> }> = ({ links }) => {
  return (
    <ul className="relative z-1 m-0 list-none p-0">
      {links.map((link) => {
        const IconComponent = getIcon(link.icon);
        return (
          <li
            key={link.title}
            aria-label={`${link.icon} icon`}
            title={link.icon}
            className="mt-4 mb-4 items-center p-0 underline-offset-4"
          >
            <Link className="flex w-full" href={link.link} target="_blank">
              <IconComponent className="mr-3" />
              <h3 className="mt-0 mb-0 text-base font-normal">{link.title}</h3>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
