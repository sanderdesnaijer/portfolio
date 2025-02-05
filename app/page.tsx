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
    <div className="container mx-auto h-screen">
      <main className="grid grid-cols-5 h-full gap-4">
        <div className="col-span-2 content-center">
          <h1 className="text-5xl font-bold mb-4">{setting.title}</h1>
          <p className="text-xl mb-4">{setting.description}</p>
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
          <Menu className="flex flex-col text-9xl font-extralight" />
        </div>
      </main>
    </div>
  );
}
