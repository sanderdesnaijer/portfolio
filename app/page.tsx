"use server";
import type { ReactNode } from "react";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  pageQuery,
  latestProjectsQuery,
  latestBlogQuery,
} from "@/sanity/lib/queries";
import { PageSanity } from "@/sanity/types";
import {
  LatestPostPreview,
  LatestProjectPreview,
} from "./components/LatestSection";
import Link from "next/link";
import { ThemeToggle } from "./components/ThemeToggle/ThemeToggle";
import { generateMetaData } from "./utils/metadata";
import { fetchCommonData } from "@/sanity/lib/fetchCommonData";
import { getTranslations } from "next-intl/server";
import { NotFound } from "./components/NotFound";
import { cache } from "react";
import { getWebsiteScheme } from "./utils/jsonLDSchemes";
import { JsonLd } from "./components/JsonLd";
import envConfig from "@/envConfig";

import SiteLogo from "@/public/logo.svg";
import { Footer } from "./components/Footer";
import { LatestSection } from "./components/LatestSection";
import { AUTHOR_NAME } from "./utils/constants";

const fetchPageData = cache(async function fetchPageData() {
  return Promise.all([
    fetchCommonData(),
    sanityFetch<PageSanity>({
      query: pageQuery,
      params: { slug: "" },
    }),
    sanityFetch<LatestProjectPreview[]>({
      query: latestProjectsQuery,
    }),
    sanityFetch<LatestPostPreview[]>({
      query: latestBlogQuery,
    }),
  ]);
});

export async function generateMetadata() {
  const [commonData, page] = await fetchPageData();
  const t = await getTranslations();

  return generateMetaData({
    title: t("pages.home.title"),
    description: t("pages.home.metaDescription"),
    publishedTime: page._createdAt,
    modifiedTime: page._updatedAt,
    imageUrl: page.imageURL || commonData.setting?.imageURL,
    imageAlt: page.imageAlt || commonData.setting?.imageAlt,
    url: envConfig.baseUrl,
  });
}

export default async function Home() {
  const [commonData, page, latestProjects, latestPosts] = await fetchPageData();
  const t = await getTranslations();

  const { setting, menuItems } = commonData;

  if (!setting || !menuItems) {
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
      <div className="container mx-auto flex min-h-dvh flex-col p-4">
        <header className="flex items-center justify-between py-2">
          <ThemeToggle className="theme-toggle cursor-pointer" />
          <nav aria-label={t("generic.mainNavigation")}>
            <ul className="flex items-center gap-6 md:gap-8">
              {menuItemsWithoutHome.map((item) => (
                <li key={item.pathname}>
                  <Link
                    href={item.pathname}
                    className="text-sm font-medium tracking-wide transition-all hover:font-bold hover:italic"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <main className="flex flex-1 flex-col">
          <div className="my-8 flex flex-col items-center text-center md:my-12 [&>svg]:m-auto">
            <SiteLogo className="h-48 transition-colors duration-200 [--logoBgColor:transparent] [--logoShapeColor:#0a0a0a] md:h-56 dark:[--logoShapeColor:white]" />
            <h1 className="mt-4 mb-2 text-center text-lg font-bold">
              {AUTHOR_NAME}
            </h1>
          </div>

          <section
            aria-label={t("pages.home.introSectionAriaLabel")}
            className="mx-auto max-w-xl px-2 py-2 text-center md:max-w-2xl md:py-4"
          >
            <p className="mb-3 text-sm leading-relaxed text-neutral-600 md:text-base dark:text-neutral-400">
              {t.rich("pages.home.introLead", {
                knmi: (chunks: ReactNode) => (
                  <abbr title={t("pages.home.knmiAbbrTitle")}>{chunks}</abbr>
                ),
              })}
            </p>
            <p className="text-sm leading-relaxed text-neutral-500 md:text-base dark:text-neutral-500">
              {t("pages.home.introClosing")}
            </p>
          </section>

          <LatestSection
            projects={latestProjects ?? []}
            posts={latestPosts ?? []}
            latestProjectsLabel={t("pages.home.latestProjects")}
            latestPostsLabel={t("pages.home.latestPosts")}
          />
        </main>

        <Footer
          socialMedia={setting.socialMedia}
          cookiePolicyLabel={t("cookies.title")}
        />
      </div>
    </>
  );
}
