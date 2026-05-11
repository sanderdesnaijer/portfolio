import { IconLink } from "@/sanity/types/types";
import { AUTHOR_INITIALS } from "../utils/constants";
import { SocialIcons } from "./SocialIcons";
import { getIcon } from "./Icons";
import Link from "next/link";
import { MenuItem } from "./Menu";

const ExternalLinkIcon = getIcon("externalLink");

/** Social platforms to keep in the global footer */
const FOOTER_SOCIAL_ICONS = ["github", "linkedin", "x", "youtube"];

const FOOTER_DESCRIPTION =
  "Frontend developer building creative browser experiments with MediaPipe, computer vision, React and hardware projects.";

const getFooterText = (): string => {
  return `© ${new Date().getFullYear()} ${AUTHOR_INITIALS}`;
};

type FooterProps = {
  socialMedia: Array<IconLink>;
  cookiePolicyLabel?: string;
  demosLabel?: string;
  footerItems?: MenuItem[];
  menuItems?: MenuItem[];
  showSeparator?: boolean;
  footerNavigationLabel: string;
};

export function Footer({
  socialMedia,
  cookiePolicyLabel = "Cookie Policy",
  demosLabel = "Demos",
  footerItems = [],
  menuItems = [],
  showSeparator = true,
  footerNavigationLabel,
}: FooterProps) {
  const footerSocials = socialMedia.filter((s) =>
    FOOTER_SOCIAL_ICONS.includes(s.icon)
  );

  return (
    <footer
      className={`relative col-span-9 border-black md:col-span-6 md:col-start-4 md:before:-bottom-10 lg:col-span-5 lg:col-start-4 xl:col-start-3 before:dark:bg-white ${showSeparator ? "after:absolute after:top-0 after:bottom-0 after:left-[-196px] after:w-px after:bg-black dark:after:bg-white" : ""}`}
    >
      <div className="flex w-[100%] flex-col border-t border-black px-6 py-4 md:col-span-5 md:px-0 lg:py-6 dark:border-white">
        <div className="flex w-full flex-col gap-4">
          {/* Internal navigation + social icons row */}
          <div className="flex w-full items-center justify-between gap-4">
            <nav aria-label={footerNavigationLabel}>
              <ul className="flex flex-wrap items-center gap-4">
                {menuItems
                  .filter(({ pathname }) => pathname !== "/")
                  .map(({ pathname, title }) => (
                    <li key={pathname}>
                      <Link href={pathname} className="text-sm hover:underline">
                        {title}
                      </Link>
                    </li>
                  ))}
                {footerItems.map(({ pathname, title }) => (
                  <li key={pathname}>
                    <Link href={pathname} className="text-sm hover:underline">
                      {title}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="https://demos.sanderdesnaijer.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm hover:underline"
                  >
                    {demosLabel}
                    <ExternalLinkIcon className="h-3 w-3 opacity-50" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/info/cookies"
                    className="text-sm hover:underline"
                  >
                    {cookiePolicyLabel}
                  </Link>
                </li>
              </ul>
            </nav>
            <SocialIcons
              socialMedia={footerSocials}
              className="flex shrink-0 flex-row gap-1"
              iconClassName="block scale-75 opacity-60 transition-all hover:opacity-100"
            />
          </div>

          {/* Description + copyright */}
          <div className="flex flex-col gap-2">
            <p className="text-xs leading-relaxed text-gray-700 dark:text-gray-300">
              {FOOTER_DESCRIPTION}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {getFooterText()}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
