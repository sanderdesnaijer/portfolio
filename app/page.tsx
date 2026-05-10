"use server";
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
import { Header } from "./components/Header";
import Link from "next/link";
import { toTagSlug } from "./utils/utils";

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

  const heroHeading = t("pages.home.heroHeadingStart");
  const lastSpaceIndex = heroHeading.lastIndexOf(" ");
  const firstLine =
    lastSpaceIndex !== -1 ? heroHeading.slice(0, lastSpaceIndex) : heroHeading;
  const secondLine =
    lastSpaceIndex !== -1 ? heroHeading.slice(lastSpaceIndex + 1) : "";

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
            <section
              aria-label={t("pages.home.introSectionAriaLabel")}
              className="my-8 mb-0 md:my-12 md:mb-0"
            >
              <h1 className="mb-0 text-center text-5xl font-extrabold tracking-tight md:text-left md:text-8xl">
                {firstLine}
                {secondLine && (
                  <>
                    <br />
                    {secondLine}
                  </>
                )}
              </h1>
              <div className="mb-6 flex flex-col-reverse items-center gap-8 md:flex-row md:items-center md:gap-12">
                <p className="flex-1 text-center text-sm leading-relaxed text-neutral-600 md:text-left md:text-base dark:text-neutral-400">
                  {t("pages.home.heroSubtitle")}
                </p>
                <div className="relative flex shrink-0 flex-col items-center">
                  <SiteLogo className="h-36 transition-colors duration-200 [--logoBgColor:transparent] [--logoShapeColor:#0a0a0a] md:h-48 dark:[--logoShapeColor:white]" />
                  <ul className="mt-1 flex max-w-36 list-none flex-wrap justify-center pl-0 text-xs md:max-w-48">
                    {[
                      "React",
                      "TypeScript",
                      "MediaPipe",
                      "WebGL",
                      "OpenLayers",
                      "Arduino",
                    ].map((tech) => (
                      <li
                        key={tech}
                        className="mt-0 pr-2 pl-0 font-bold text-gray-600 dark:text-gray-400"
                      >
                        <Link
                          className="relative z-10 no-underline hover:underline"
                          href={`/tags/${toTagSlug(tech)}`}
                        >
                          {tech}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <LatestSection
              projects={latestProjects ?? []}
              posts={latestPosts ?? []}
              latestProjectsLabel={t("pages.home.latestProjects")}
              latestPostsLabel={t("pages.home.latestPosts")}
              viewProjectsLabel={t("pages.home.viewProjects")}
              readArticlesLabel={t("pages.home.readArticles")}
            />
          </div>
        </main>
        <Footer
          socialMedia={setting.socialMedia}
          cookiePolicyLabel={t("cookies.title")}
          footerItems={commonData.footerItems}
          showSeparator={false}
        />
      </div>
    </>
  );
}
