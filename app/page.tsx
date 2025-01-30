import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";
import Link from "next/link";
import { SettingSanity } from "@/sanity/types";
import { PageNotFound } from "./components/PageNotFound";
import { getIcon } from "./components/Icons";

export default async function Home() {
  const setting = await sanityFetch<SettingSanity>({ query: settingsQuery });

  if (!setting) {
    return <PageNotFound />;
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-5xl">{setting.title}</h1>
        <p>{setting.description}</p>
        <ul>
          {setting.socialMedia?.map(async (media) => {
            const { icon, link } = media;
            const IconComponent = getIcon(icon);

            return (
              <li key={icon}>
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
      </main>
    </div>
  );
}
