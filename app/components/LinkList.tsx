import { IconLink } from "@/sanity/types/types";
import { getIcon } from "./Icons";

export const LinkList: React.FC<{ links: Array<IconLink> }> = ({ links }) => {
  return (
    <ul className="p-0 m-0 list-none">
      {links.map((link) => {
        const IconComponent = getIcon(link.icon);

        return (
          <li
            key={link.title}
            aria-label={`${link.icon} icon`}
            title={link.icon}
            className="flex items-center w-full p-0 mb-4 mt-4"
          >
            <IconComponent className="mr-4" />
            <h3 className="font-normal text-base mt-0 mb-0">{link.title}</h3>
          </li>
        );
      })}
    </ul>
  );
};
