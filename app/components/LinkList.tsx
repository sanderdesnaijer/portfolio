import { IconLink } from "@/sanity/types/types";
import { getIcon } from "./Icons";

export const LinkList: React.FC<{ links: Array<IconLink> }> = ({ links }) => {
  return (
    <ul className="m-0 list-none p-0">
      {links.map((link) => {
        const IconComponent = getIcon(link.icon);

        return (
          <li
            key={link.title}
            aria-label={`${link.icon} icon`}
            title={link.icon}
            className="mt-4 mb-4 flex w-full items-center p-0"
          >
            <IconComponent className="mr-4" />
            <h3 className="mt-0 mb-0 text-base font-normal">{link.title}</h3>
          </li>
        );
      })}
    </ul>
  );
};
