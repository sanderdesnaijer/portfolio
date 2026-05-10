"use server";
// import type { ReactNode } from "react";
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
// import { AUTHOR_NAME } from "./utils/constants";
import { Header } from "./components/Header";
import Link from "next/link";

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
            <section
              aria-label={t("pages.home.introSectionAriaLabel")}
              className="my-8 flex flex-col-reverse items-center gap-8 md:my-12 md:flex-row md:items-center md:gap-12"
            >
              <div className="flex-1 text-center md:text-left">
                <h1 className="mb-4 text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
                  {t("pages.home.heroHeadingStart")}
                </h1>
                <p className="mb-6 text-sm leading-relaxed text-neutral-600 md:text-base dark:text-neutral-400">
                  {t("pages.home.heroSubtitle")}
                </p>
                <div className="mb-6 flex flex-wrap justify-center gap-2 md:justify-start">
                  {[
                    "React",
                    "TypeScript",
                    "MediaPipe",
                    "WebGL",
                    "OpenLayers",
                    "Arduino",
                  ].map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-700 dark:border-neutral-700 dark:text-neutral-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap justify-center gap-3 md:justify-start">
                  <Link
                    href="/projects"
                    className="inline-flex items-center gap-1 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white no-underline transition-colors hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                  >
                    {t("pages.home.viewProjects")}
                    <span aria-hidden="true">&rarr;</span>
                  </Link>
                  <Link
                    href="/blog"
                    className="inline-flex items-center rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-900 no-underline transition-colors hover:bg-neutral-100 dark:border-neutral-600 dark:text-white dark:hover:bg-neutral-800"
                  >
                    {t("pages.home.readArticles")}
                  </Link>
                </div>
              </div>
              <div className="relative flex shrink-0 flex-col items-center">
                <SiteLogo className="h-36 transition-colors duration-200 [--logoBgColor:transparent] [--logoShapeColor:#0a0a0a] md:h-48 dark:[--logoShapeColor:white]" />
                {/* <span className="mt-3 text-center text-xs text-neutral-400 italic dark:text-neutral-500">
                  {t("pages.home.heroAnnotation")}
                </span> */}
              </div>
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
          footerItems={commonData.footerItems}
          showSeparator={false}
        />
      </div>
    </>
  );
}
