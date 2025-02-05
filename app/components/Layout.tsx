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
    <div className="grid grid-cols-9 container mx-auto">
      <div className="col-span-2 sticky top-0 h-screen flex justify-end p-6 gap-4">
        <div className="flex flex-col justify-end">
          <span
            className="text-lg font-bold mb-2"
            style={{
              writingMode: "vertical-rl",
            }}
          >
            {authorName}
          </span>
          <ul className="flex flex-col gap-2 left-0">
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
      <main className="prose prose-xl dark:prose-invert col-span-5 max-w-fit py-24 relative">
        <h1 className="font-bold text-8xl mb-10">{pageTitle}</h1>
        {children}
      </main>
    </div>
  );
};
