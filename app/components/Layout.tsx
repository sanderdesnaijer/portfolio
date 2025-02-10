import Menu from "@/app/components/Menu";
import { IconLink } from "@/sanity/types/types";
import { getIcon } from "./Icons";
import Link from "next/link";

export const Layout: React.FC<{
  children?: React.ReactNode;
  pageTitle: string;
  socialMedia: Array<IconLink>;
  authorName: string;
  rightColSlot?: React.ReactNode;
}> = ({ children, pageTitle, socialMedia, authorName, rightColSlot }) => {
  return (
    <div className="container mx-auto grid grid-cols-9">
      <div className="sticky top-0 col-span-2 flex h-screen justify-end gap-4 p-6">
        <div className="flex flex-col justify-end">
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
      <main className="prose prose-xl dark:prose-invert relative col-span-5 max-w-fit pt-24">
        <div className="flex h-full flex-col">
          <h1 className="relative mb-10 text-8xl font-bold after:absolute after:right-0 after:-bottom-10 after:left-[-196px] after:h-px after:w-[100vw] after:bg-current dark:bg-white">
            {pageTitle}
          </h1>
          <div className="relative flex-1 pt-12 pb-12 after:absolute after:top-0 after:right-0 after:bottom-0 after:left-[-196px] after:w-px after:bg-black dark:after:bg-white">
            {children}
          </div>
        </div>
      </main>
      {rightColSlot && <div className="col-span-2 pt-24">{rightColSlot}</div>}
    </div>
  );
};
