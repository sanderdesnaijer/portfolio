import Menu from "@/app/components/Menu";
import { IconLink } from "@/sanity/types/types";
import { getIcon } from "./Icons";
import Link from "next/link";

export const Layout: React.FC<{
  children?: React.ReactNode;
  title: string;
  socialMedia: Array<IconLink>;
}> = ({ children, title, socialMedia }) => {
  return (
    <div className="grid grid-cols-9 container mx-auto">
      <div className="col-span-2 sticky top-0 h-screen flex justify-end p-6">
        <ul className="flex flex-col gap-2 absolute bottom-4 left-0">
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
        <Menu />
      </div>
      <main className="prose prose-xl dark:prose-invert col-span-5 max-w-fit py-24 relative">
        <h1 className="font-bold text-8xl mb-10">{title}</h1>
        {children}
      </main>
    </div>
  );
};
