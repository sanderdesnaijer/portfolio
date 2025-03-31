"use server";
import { sanityFetch } from "@/sanity/lib/fetch";
import { pageQuery } from "@/sanity/lib/queries";
import { PageSanity } from "@/sanity/types";
import Menu from "./components/Menu";
import { ThemeToggle } from "./components/ThemeToggle/ThemeToggle";
import { generateMetaData } from "./utils/metadata";
import { fetchCommonData } from "@/sanity/lib/fetchCommonData";
import { getTranslations } from "next-intl/server";
import { NotFound } from "./components/NotFound";
import { generateTitle } from "./utils/utils";

import { cache } from "react";
import { getWebsiteScheme } from "./utils/jsonLDSchemes";
import { JsonLd } from "./components/JsonLd";
import envConfig from "@/envConfig";

import SiteLogo from "../public/logo.svg";

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

  const menuItemsWithoutHome = menuItems.filter(
    (item) => item.title !== "Home"
  );

  return (
    <>
      {jsonLd && <JsonLd value={jsonLd} />}
      <div className="container mx-auto h-screen p-4">
        <ThemeToggle className="theme-toggle absolute right-6 cursor-pointer" />
        <main className="flex h-full flex-col md:justify-center">
          <div className="max-h-1/4 justify-items-center [&>svg]:m-auto [&>svg]:h-full">
            <SiteLogo />
          </div>
          <h1 className="-mt-5 mb-10 text-center text-lg font-bold">
            {setting.title}
          </h1>

          <Menu
            menuItems={menuItemsWithoutHome}
            className="group home flex flex-col text-7xl font-extralight [&>ul]:relative [&>ul]:block [&>ul]:h-full [&>ul>li]:mb-2 [&>ul>li]:w-auto [&>ul>li>a]:text-center [&>ul>li>a]:md:hover:translate-x-0"
          />
        </main>
      </div>
    </>
  );
}
