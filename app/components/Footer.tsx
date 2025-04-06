import { IconLink } from "@/sanity/types/types";
import { AUTHOR_INITIALS } from "../utils/constants";
import { SocialIcons } from "./SocialIcons";

const getFooterText = (): string => {
  return `© ${new Date().getFullYear()} ${AUTHOR_INITIALS}`;
};

export const Footer: React.FC<{ socialMedia: Array<IconLink> }> = ({
  socialMedia,
}) => (
  <footer className="relative col-span-9 border-black after:absolute after:top-0 after:bottom-0 after:left-[-196px] after:w-px after:bg-black md:col-span-6 md:col-start-4 md:before:-bottom-10 lg:col-span-5 lg:col-start-4 xl:col-start-3 before:dark:bg-white dark:after:bg-white">
    <div className="flex items-center justify-center border-t border-black py-6 pr-2 md:col-span-5 md:justify-end dark:border-white">
      <p className="text-sm">{getFooterText()}</p>
      <SocialIcons
        socialMedia={socialMedia}
        className="group left-0 ml-2 flex flex-row gap-2"
      />
    </div>
  </footer>
);
