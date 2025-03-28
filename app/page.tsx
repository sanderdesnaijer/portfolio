"use server";
import { sanityFetch } from "@/sanity/lib/fetch";
import { pageQuery } from "@/sanity/lib/queries";
import { PageSanity } from "@/sanity/types";
import Menu from "./components/Menu";
import { ThemeToggle } from "./components/ThemeToggle/ThemeToggle";
import { SocialIcons } from "./components/SocialIcons";
import { generateMetaData } from "./utils/metadata";
import { fetchCommonData } from "@/sanity/lib/fetchCommonData";
import { getTranslations } from "next-intl/server";
import { NotFound } from "./components/NotFound";
import { generateTitle } from "./utils/utils";

import { cache } from "react";
import { getWebsiteScheme } from "./utils/jsonLDSchemes";
import { JsonLd } from "./components/JsonLd";
import envConfig from "@/envConfig";

const fetchPageData = cache(async function fetchPageData() {
  return sanityFetch<PageSanity>({
    query: pageQuery,
    params: { slug: "" },
  });
});

export async function generateMetadata() {
  const page = await fetchPageData();

  return generateMetaData({
    title: generateTitle(),
    description: page.description,
    publishedTime: page._createdAt,
    modifiedTime: page._updatedAt,
    imageUrl: page.imageURL,
    url: envConfig.baseUrl,
  });
}

export default async function Home() {
  const { setting, menuItems } = await fetchCommonData();
  const page = await fetchPageData();

  if (!setting || !menuItems) {
    const t = await getTranslations();

    return (
      <NotFound
        title={t("error.404.generic.action")}
        description={t("error.404.generic.description")}
      />
    );
  }

  const jsonLd =
    page && setting
      ? getWebsiteScheme(
          page,
          setting.socialMedia.find((s) => s.title === "LinkedIn")?.link
        )
      : null;

  return (
    <>
      {jsonLd && <JsonLd value={jsonLd} />}
      <div className="container mx-auto h-screen p-4">
        <ThemeToggle className="theme-toggle absolute right-6 cursor-pointer" />
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
              className="flex flex-col text-7xl font-extralight md:text-9xl [&>ul]:relative [&>ul]:block"
            />
          </div>
        </main>
      </div>
    </>
  );
}
