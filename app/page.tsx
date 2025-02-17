import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";
import Link from "next/link";
import { SettingSanity } from "@/sanity/types";
import { PageNotFound } from "./components/PageNotFound";
import { getIcon } from "./components/Icons";
import Menu from "./components/Menu";

export default async function Home() {
  const setting = await sanityFetch<SettingSanity>({ query: settingsQuery });

  if (!setting) {
    return <PageNotFound />;
  }

  return (
    <div className="container mx-auto h-screen p-4">
      <main className="grid grid-cols-6 gap-4 sm:h-full">
        <div className="col-span-6 sm:col-span-2 sm:content-center">
          <h1 className="mb-4 text-3xl font-bold sm:text-5xl">
            {setting.title}
          </h1>
          <p className="mb-4 text-xl">{setting.description}</p>
          <ul className="flex gap-2">
            {setting.socialMedia?.map((media) => {
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
        <div className="col-span-3 content-center">
          <Menu className="flex flex-col text-7xl font-extralight sm:text-9xl" />
        </div>
      </main>
    </div>
  );
}
