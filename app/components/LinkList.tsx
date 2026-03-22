import { IconLink } from "@/sanity/types/types";
import { getIcon } from "./Icons";
import { CustomLink } from "./CustomLink";
import { useTranslations } from "next-intl";

export const LinkList: React.FC<{ links: Array<IconLink> }> = ({ links }) => {
  const t = useTranslations();
  const title = t("pages.project.resources");

  return (
    <>
      <h2 id="resources" className="mt-4 text-lg font-bold">
        {title}
      </h2>
      <ul aria-label={title} className="group relative z-1 m-0 list-none p-0">
        {links.map((link) => {
          const IconComponent = getIcon(link.icon);
          return (
            <li
              key={link.title}
              aria-label={`${link.icon} icon`}
              title={link.icon}
              className="group/item mt-4 mb-4 items-center p-0 transition-transform"
            >
              <CustomLink
                href={link.link}
                title={link.title}
                icon={
                  <IconComponent className="mr-3 transition-transform group-hover/item:scale-110" />
                }
              />
            </li>
          );
        })}
      </ul>
    </>
  );
};
