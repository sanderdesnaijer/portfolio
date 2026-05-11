import { IconLink } from "@/sanity/types/types";
import { AUTHOR_INITIALS } from "../utils/constants";
import { SocialIcons } from "./SocialIcons";
import { getIcon } from "./Icons";
import Link from "next/link";
import { MenuItem } from "./Menu";

const ExternalLinkIcon = getIcon("externalLink");

const getFooterText = (): string => {
  return `© ${new Date().getFullYear()} ${AUTHOR_INITIALS}`;
};

export const Footer: React.FC<{
  socialMedia: Array<IconLink>;
  cookiePolicyLabel?: string;
  demosLabel?: string;
  footerItems?: MenuItem[];
  showSeparator?: boolean;
}> = ({
  socialMedia,
  cookiePolicyLabel = "Cookie Policy",
  demosLabel = "Demos",
  footerItems = [],
  showSeparator = true,
}) => {
  return (
    <footer
      className={`relative col-span-9 border-black md:col-span-6 md:col-start-4 md:before:-bottom-10 lg:col-span-5 lg:col-start-4 xl:col-start-3 before:dark:bg-white ${showSeparator ? "after:absolute after:top-0 after:bottom-0 after:left-[-196px] after:w-px after:bg-black dark:after:bg-white" : ""}`}
    >
      <div className="flex w-[100%] flex-col border-t border-black py-4 pr-2 md:col-span-5 lg:py-6 dark:border-white">
        <div className="flex w-full items-center justify-between gap-4 xl:hidden">
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/info/cookies" className="text-sm hover:underline">
              {cookiePolicyLabel}
            </Link>
            {footerItems.map(({ pathname, title }) => (
              <Link
                key={pathname}
                href={pathname}
                className="text-sm hover:underline"
              >
                {title}
              </Link>
            ))}
            <Link
              href="https://demos.sanderdesnaijer.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm hover:underline"
            >
              {demosLabel}
              <ExternalLinkIcon className="h-3 w-3 opacity-50" />
            </Link>
          </div>
          <SocialIcons
            socialMedia={socialMedia}
            className="group left-0 flex flex-row gap-2"
          />
        </div>
        <p className="mt-2 text-center text-sm xl:hidden">{getFooterText()}</p>

        <div className="hidden w-full items-center justify-between gap-4 xl:flex">
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/info/cookies" className="text-sm hover:underline">
              {cookiePolicyLabel}
            </Link>
            {footerItems.map(({ pathname, title }) => (
              <Link
                key={pathname}
                href={pathname}
                className="text-sm hover:underline"
              >
                {title}
              </Link>
            ))}
            <Link
              href="https://demos.sanderdesnaijer.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm hover:underline"
            >
              {demosLabel}
              <ExternalLinkIcon className="h-3 w-3 opacity-50" />
            </Link>
          </div>
          <p className="text-sm">{getFooterText()}</p>
          <SocialIcons
            socialMedia={socialMedia}
            className="group left-0 flex flex-row gap-2"
          />
        </div>
      </div>
    </footer>
  );
};
