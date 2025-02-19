import Menu from "@/app/components/Menu";
import { IconLink } from "@/sanity/types/types";
import { getIcon } from "./Icons";
import Link from "next/link";

export const Layout: React.FC<{
  children?: React.ReactNode;
  pageTitle: string;
  socialMedia: Array<IconLink>;
  authorName: string;
}> = ({ children, pageTitle, socialMedia, authorName }) => {
  return (
    <div className="container mx-auto grid grid-cols-9">
      <div className="bg top-0 z-20 col-span-9 justify-end gap-4 p-6 pb-0 md:sticky md:col-span-2 md:flex md:h-screen md:pb-6">
        <div className="hidden flex-col justify-end md:flex">
          <span
            className="mb-2 text-lg font-bold"
            style={{
              writingMode: "vertical-rl",
            }}
          >
            {authorName}
          </span>
          <ul className="left-0 flex flex-col gap-2">
            {socialMedia?.map((media) => {
              const { icon, link } = media;
              const IconComponent = getIcon(icon);
              return (
                <li key={icon} className="">
                  <Link
                    href={link}
                    target="_blank"
                    aria-label={`${icon} icon`}
                    title={icon}
                  >
                    <IconComponent />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <Menu />
      </div>
      <main className="prose prose-xl dark:prose-invert relative col-span-9 max-w-fit px-6 pt-6 md:col-span-5 md:px-0 md:pt-24">
        <div className="flex h-full flex-col">
          <h1 className="relative mb-10 text-5xl font-bold after:absolute after:right-0 after:-bottom-5 after:-left-10 after:h-px after:w-[100vw] after:bg-current md:text-8xl md:after:-bottom-10 md:after:left-[-196px] after:dark:bg-white">
            {pageTitle}
          </h1>
          <div className="relative flex-1 pt-6 pb-12 after:absolute after:top-0 after:right-0 after:bottom-0 after:left-[-196px] after:w-px after:bg-black md:pt-12 dark:after:bg-white">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
