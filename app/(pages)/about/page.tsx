"use server";
import { sanityFetch } from "@/sanity/lib/fetch";
import { jobsQuery, pageQuery } from "@/sanity/lib/queries";
import { PortableText, PortableTextReactComponents } from "next-sanity";
import Image from "next/image";
import { JobSanity, PageSanity } from "@/sanity/types";
import { convertDate } from "@/app/utils/utils";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Layout } from "@/app/components/Layout";
import { Tags } from "@/app/components/Tags";
import { generatePageMetadata } from "@/app/utils/metadata";
import { fetchCommonData } from "@/sanity/lib/fetchCommonData";
import { NotFound } from "@/app/components/NotFound";
import { pageSlugs } from "@/app/utils/routes";
import { urlFor } from "@/sanity/lib/image";
import { getAboutScheme } from "@/app/utils/jsonLDSchemes";
import { JsonLd } from "@/app/components/JsonLd";
import envConfig from "@/envConfig";

const mainImageSizeHeigth = 341;
const mainImageSizeWidtht = 256;
const companyIconSize = 56;
const { about: slug } = pageSlugs;

const components: Partial<PortableTextReactComponents> = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="text-lg leading-8">{children}</p>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="mb-10 w-2/3 text-4xl font-extralight">{children}</h2>
    ),
    span: ({ children }: { children?: React.ReactNode }) => (
      <span className="mb-10 block w-2/3 pr-2 text-2xl font-extralight md:text-4xl">
        {children}
      </span>
    ),
  },
  marks: {
    link: ({
      children,
      value,
    }: {
      children?: React.ReactNode;
      value?: { href: string };
    }) => (
      <Link
        href={value?.href || "#"}
        className="underline underline-offset-2 transition-all duration-100 hover:underline-offset-4"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </Link>
    ),
  },
};

const jobComponents: Partial<PortableTextReactComponents> = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-3 text-sm leading-6 text-gray-800 group-hover/item:text-gray-900 dark:text-gray-100 dark:group-hover/item:text-gray-50">
        {children}
      </p>
    ),
  },
};

const getExperienceTitle = (
  startDate: string,
  endDate: string | undefined,
  presentTitle: string
): string => {
  const start = convertDate(startDate);
  const end = endDate ? convertDate(endDate) : presentTitle;
  return `${start} - ${end}`;
};

export async function generateMetadata() {
  return generatePageMetadata({ pageSlug: slug });
}

export default async function Page() {
  const page = await sanityFetch<PageSanity>({
    query: pageQuery,
    params: { slug },
  });

  const jobs = await sanityFetch<JobSanity[]>({
    query: jobsQuery,
  });
  const { setting, menuItems } = await fetchCommonData();
  const t = await getTranslations();

  const activeJobs = jobs.reduce(
    (list: string[], job) =>
      job.endDate === null ? list.concat(job.companyName) : list,
    []
  );

  const jsonLD =
    page && setting
      ? getAboutScheme({
          page,
          jobs: activeJobs,
          jobTitle: t("pages.about.jobTitle"),
          links: setting.socialMedia.map((s) => s.link),
        })
      : null;

  const title = page ? page.title : t("error.404.generic.title");

  return (
    <>
      {jsonLD ? <JsonLd value={jsonLD} /> : null}
      <Layout
        pageTitle={title}
        socialMedia={setting.socialMedia}
        authorName={setting.title}
        menuItems={menuItems}
      >
        {page ? (
          <>
            <div className="not-prose absolute -top-[169px] -right-[100px] z-10 mt-[60px] mr-[100px] w-[120px] border-b-1 border-black border-b-black bg-white p-2 before:absolute before:top-[88px] before:right-0 before:bottom-0 before:border-r before:border-black before:content-[''] after:absolute after:top-[88px] after:bottom-0 after:left-0 after:border-l after:border-black after:content-[''] md:mt-auto md:mr-auto md:w-auto md:before:top-[168px] md:after:top-[168px] dark:border-white dark:bg-black dark:before:border-white dark:after:border-white">
              <Image
                alt={page.imageAlt}
                src={urlFor(page.imageURL)
                  .width(mainImageSizeWidtht)
                  .height(mainImageSizeHeigth)
                  .url()}
                width={mainImageSizeWidtht}
                height={mainImageSizeHeigth}
                priority
              />
            </div>
            {page?.body ? (
              <div className="md:py-10">
                <PortableText value={page.body} components={components} />
              </div>
            ) : null}

            <h2 className="font-normal">{t("pages.about.jobExperience")}</h2>
            <ol
              aria-label={t("pages.about.professionalExperience")}
              className="not-prose group/list mb-3 flex list-none flex-col gap-10 p-0"
            >
              {jobs?.map((job) => {
                return (
                  <li
                    key={job._id}
                    className="group/item relative transition-colors duration-100 md:flex"
                  >
                    <div className="md:w-2/7">
                      <p className="mt-0 mb-2 text-sm text-gray-800 italic md:text-right dark:text-gray-100">
                        {getExperienceTitle(
                          job.startDate,
                          job.endDate,
                          t("pages.about.datePresent")
                        )}
                      </p>
                    </div>
                    <div className="md:w-5/7 md:pl-4">
                      <Link
                        href={job.link}
                        aria-label={`[Link to] ${job.companyName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/link mb-2 flex"
                      >
                        <Image
                          alt={job.imageURL}
                          src={urlFor(job.imageURL)
                            .width(companyIconSize)
                            .height(companyIconSize)
                            .url()}
                          width={companyIconSize}
                          height={companyIconSize}
                          className="mt-0 h-fit transition group-hover/link:scale-105"
                        />
                        <div className="pl-3">
                          <h3 className="-mt-[3px] text-lg leading-[22px] font-bold transition-transform group-hover/link:translate-x-1 group-hover/link:italic after:absolute after:h-5 after:w-5 after:bg-black after:transition-all after:duration-150 after:[mask-image:url(/icons/arrow-outward.svg)] group-hover/link:after:translate-x-1 hover:after:translate-x-1 dark:after:bg-white">
                            {job.companyName.trim()}
                          </h3>
                          <p className="text-base transition group-hover/link:translate-x-1">
                            {job.jobTitle}
                          </p>
                          <p className="text-xs text-gray-800 italic transition group-hover/link:translate-x-1 dark:text-gray-100">
                            {job.employmentType}{" "}
                            {job.contractName &&
                              `(${t("pages.about.jobContract")} ${job.contractName})`}
                          </p>
                        </div>
                      </Link>
                      <PortableText
                        value={job.description}
                        components={jobComponents}
                      />

                      {job.tags && <Tags tags={job.tags} />}
                    </div>
                  </li>
                );
              })}
            </ol>
          </>
        ) : (
          <NotFound
            title={t("error.404.generic.action")}
            description={t("error.404.generic.description")}
            href={envConfig.baseUrl}
          />
        )}
      </Layout>
    </>
  );
}
