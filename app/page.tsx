import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";
import Image from "next/image";
import Link from "next/link";
import { ICON_SIZE } from "./utils/constants";
import { SettingSanity } from "@/sanity/types";

export default async function Home({ params }: { params: { slug: string } }) {
  const slug = params.slug || null;

  const setting = await sanityFetch<SettingSanity>({ query: settingsQuery });

  if (!setting) {
    return (
      <div>
        <p>Page not found for slug: {slug}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-5xl">{setting.title}</h1>
        <p>{setting.description}</p>
        <ul>
          {setting.socialMedia.map((media) => {
            const { icon, link } = media;
            const iconUrl = `/icons/${icon}.svg`;

            return (
              <li key={icon}>
                <Link href={link} target="_blank">
                  <Image
                    aria-hidden
                    src={iconUrl}
                    alt={`${icon} icon`}
                    width={ICON_SIZE}
                    height={ICON_SIZE}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
