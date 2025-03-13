"use server";
import { sanityFetch } from "@/sanity/lib/fetch";
import { pageQuery } from "@/sanity/lib/queries";
import { PageSanity } from "@/sanity/types";
import Menu from "./components/Menu";
import { ThemeToggle } from "./components/ThemeToggle/ThemeToggle";
import { SocialIcons } from "./components/SocialIcons";
import { generateMetaData } from "./utils/metadata";
import { AUTHOR_NAME } from "./utils/constants";
import { fetchCommonData } from "@/sanity/lib/fetchCommonData";
import { getTranslations } from "next-intl/server";
import { NotFound } from "./components/NotFound";

export async function generateMetadata() {
  const page = await sanityFetch<PageSanity>({
    query: pageQuery,
    params: { slug: "" },
  });

  return generateMetaData({
    title: AUTHOR_NAME,
    description: page.description,
    publishedTime: page._createdAt,
    modifiedTime: page._updatedAt,
    imageUrl: page.imageURL,
    url: process.env.NEXT_PUBLIC_BASE_URL!,
  });
}

export default async function Home() {
  const { setting, menuItems } = await fetchCommonData();

  if (!setting || !menuItems) {
    const t = await getTranslations();

    return (
      <NotFound
        title={t("error.404.generic.action")}
        description={t("error.404.generic.description")}
      />
    );
  }

  return (
    <div className="container mx-auto h-screen p-4">
      <ThemeToggle />
      <main className="grid grid-cols-6 gap-4 md:h-full">
        <div className="col-span-6 md:col-span-2 md:content-center">
          <h1 className="mb-4 text-3xl font-bold md:text-5xl">
            {setting.title}
          </h1>
          <p className="mb-4 text-xl">{setting.description}</p>
          <SocialIcons
            className="flex gap-2"
            socialMedia={setting.socialMedia}
          />
        </div>
        <div className="col-span-3 content-center">
          <Menu
            menuItems={menuItems}
            className="flex flex-col text-7xl font-extralight md:text-9xl"
          />
        </div>
      </main>
    </div>
  );
}
