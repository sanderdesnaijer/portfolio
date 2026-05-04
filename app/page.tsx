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
import { generatePageMetadata } from "./utils/metadata";
import { fetchCommonData } from "@/sanity/lib/fetchCommonData";
import { getTranslations } from "next-intl/server";
import { NotFound } from "./components/NotFound";
import { cache } from "react";
import { getWebsiteScheme } from "./utils/jsonLDSchemes";
import { JsonLd } from "./components/JsonLd";

import SiteLogo from "@/public/logo.svg";
import { Footer } from "./components/Footer";
import { LatestSection } from "./components/LatestSection";
import { AUTHOR_NAME } from "./utils/constants";
import { Header } from "./components/Header";

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

  return generatePageMetadata({
    pageSlug: "",
    page,
    setting: commonData.setting,
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

  return (
    <>
      {jsonLd && <JsonLd value={jsonLd} />}
      <div className="mx-auto grid grid-cols-9 pt-0 md:container">
        <Header menuItems={menuItems} />
        <main className="prose prose-xl dark:prose-invert relative col-span-9 max-w-fit px-6 pb-6 md:col-span-6 md:px-0 md:pt-6 md:pb-0 lg:col-span-5">
          <div className="flex min-h-full flex-col">
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
          </div>
        </main>
        <Footer
          socialMedia={setting.socialMedia}
          cookiePolicyLabel={t("cookies.title")}
          showSeparator={false}
        />
      </div>
    </>
  );
}
