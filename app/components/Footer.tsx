import { IconLink } from "@/sanity/types/types";
import { AUTHOR_INITIALS } from "../utils/constants";
import { SocialIcons } from "./SocialIcons";
import Link from "next/link";

const getFooterText = (): string => {
  return `© ${new Date().getFullYear()} ${AUTHOR_INITIALS}`;
};

export const Footer: React.FC<{
  socialMedia: Array<IconLink>;
  cookiePolicyLabel?: string;
}> = ({ socialMedia, cookiePolicyLabel = "Cookie Policy" }) => {
  return (
    <footer className="relative col-span-9 border-black after:absolute after:top-0 after:bottom-0 after:left-[-196px] after:w-px after:bg-black md:col-span-6 md:col-start-4 md:before:-bottom-10 lg:col-span-5 lg:col-start-4 xl:col-start-3 before:dark:bg-white dark:after:bg-white">
      <div className="flex w-[100%] flex-col items-center justify-between border-t border-black py-4 pr-2 md:col-span-5 md:flex-row md:py-6 dark:border-white">
        <Link
          href="/info/cookies"
          className="mb-2 text-sm hover:underline md:mb-0"
        >
          {cookiePolicyLabel}
        </Link>
        <div className="flex flex-col items-center md:flex-row">
          <p className="mb-2 text-sm md:mb-0">{getFooterText()}</p>
          <SocialIcons
            socialMedia={socialMedia}
            className="group left-0 ml-2 flex flex-row gap-2"
          />
        </div>
      </div>
    </footer>
  );
};
