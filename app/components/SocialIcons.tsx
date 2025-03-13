import { IconLink } from "@/sanity/types/types";
import { getIcon } from "./Icons";
import Link from "next/link";

export const SocialIcons: React.FC<{
  socialMedia: IconLink[];
  className?: string;
}> = ({
  socialMedia = [],
  className = "group left-0 flex gap-2 md:flex-col",
}) => {
  return (
    <ul className={className}>
      {socialMedia.map((media) => {
        const { icon, link } = media;
        const IconComponent = getIcon(icon);
        return (
          <li
            key={icon}
            className="scale-100 transition-transform duration-100 hover:scale-110"
          >
            <Link
              href={link}
              target="_blank"
              aria-label={`${icon} icon`}
              title={icon}
              rel="noopener noreferrer"
            >
              <IconComponent />
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
