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

import SiteLogo from "@/public/logo.svg";
import { Footer } from "./components/Footer";
import { AUTHOR_NAME } from "./utils/constants";

const fetchPageData = cache(async function fetchPageData() {
  return Promise.all([
    fetchCommonData(),
    sanityFetch<PageSanity>({
      query: pageQuery,
      params: { slug: "" },
    }),
  ]);
});

export async function generateMetadata() {
  const [commonData, page] = await fetchPageData();

  return generateMetaData({
    title: generateTitle(),
    description: page.description || commonData.setting.description,
    publishedTime: page._createdAt,
    modifiedTime: page._updatedAt,
    imageUrl: page.imageURL || commonData.setting?.imageURL,
    imageAlt: page.imageAlt || commonData.setting?.imageAlt,
    url: envConfig.baseUrl,
  });
}

export default async function Home() {
  const [commonData, page] = await fetchPageData();

  const { setting, menuItems } = commonData;

  if (!setting || !menuItems) {
    const t = await getTranslations();

    return (
      <NotFound
        title={t("error.404.generic.title")}
        action={t("error.404.generic.action")}
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
      <div className="container mx-auto flex h-dvh flex-col justify-between p-4 md:justify-start">
        <main className="relative flex flex-col justify-center md:flex-1">
          <ThemeToggle className="theme-toggle absolute top-0 right-0 cursor-pointer md:right-auto md:left-6" />

          <div className="justify-items-center [&>svg]:m-auto">
            <SiteLogo className="h-56 transition-colors duration-200 [--logoBgColor:transparent] [--logoShapeColor:#0a0a0a] dark:[--logoShapeColor:white]" />
            <h1 className="my-6 mt-0 text-center text-lg font-bold">
              {AUTHOR_NAME}
            </h1>
          </div>
          <Menu
            menuItems={menuItemsWithoutHome}
            className="group home flex flex-col text-7xl font-extralight [&>ul]:relative [&>ul]:block [&>ul]:h-full [&>ul>li]:mb-2 [&>ul>li]:w-auto [&>ul>li>a]:text-center [&>ul>li>a]:md:hover:translate-x-0"
          />
        </main>

        <Footer socialMedia={setting.socialMedia} />
      </div>
    </>
  );
}
