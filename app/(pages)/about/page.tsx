"use server";
import { sanityFetch } from "@/sanity/lib/fetch";
import { jobsQuery, pageQuery } from "@/sanity/lib/queries";
import { PortableText, PortableTextReactComponents } from "next-sanity";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/sanity/lib/client";
import { JobSanity, PageSanity } from "@/sanity/types";
import { convertDate } from "@/app/utils/utils";
import { PageNotFound } from "@/app/components/PageNotFound";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Layout } from "@/app/components/Layout";
import { Tags } from "@/app/components/Tags";
import { getChevronClasses } from "@/app/utils/tailwind";
import { generatePageMetadata } from "@/app/utils/metadata";
import { fetchCommonData } from "@/sanity/lib/fetchCommonData";

const slug = "about";
const builder = imageUrlBuilder(client);
const mainImageSizeHeigth = 341;
const mainImageSizeWidtht = 256;
const companyIconSize = 56;

const components: Partial<PortableTextReactComponents> = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="text-lg leading-8">{children}</p>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="mb-10 w-2/3 text-4xl font-extralight">{children}</h2>
    ),
    span: ({ children }: { children?: React.ReactNode }) => (
      <span className="mb-10 block w-2/3 text-lg font-extralight md:text-4xl">
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
      <p className="mb-3 text-sm leading-6">{children}</p>
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

  if (!page) {
    return <PageNotFound />;
  }

  return (
    <Layout
      pageTitle={page.title}
      socialMedia={setting.socialMedia}
      authorName={setting.title}
      menuItems={menuItems}
    >
      <div className="not-prose absolute -top-[169px] -right-[100px] z-10 mt-[60px] mr-[100px] w-[120px] border-b-1 border-black border-b-black bg-white p-2 before:absolute before:top-[88px] before:right-0 before:bottom-0 before:border-r before:border-black before:content-[''] after:absolute after:top-[88px] after:bottom-0 after:left-0 after:border-l after:border-black after:content-[''] md:mt-auto md:mr-auto md:w-auto md:before:top-[168px] md:after:top-[168px] dark:border-white dark:bg-black dark:before:border-white dark:after:border-white">
        <Image
          alt={page.imageAlt}
          src={builder
            .image(page.imageURL)
            .width(mainImageSizeWidtht)
            .height(mainImageSizeHeigth)
            .url()}
          width={mainImageSizeWidtht}
          height={mainImageSizeHeigth}
          priority
        />
      </div>
      {page?.body ? (
        <PortableText value={page.body} components={components} />
      ) : null}

      <h2 className="font-normal">{t("pages.about.jobExperience")}</h2>
      <ol className="not-prose group/list flex list-none flex-col gap-10 p-0">
        {jobs?.map((job) => {
          return (
            <li
              key={job._id}
              className="group/item relative transition-colors duration-100 md:flex"
            >
              <div className="md:w-2/7">
                <p className="mt-0 mb-2 text-sm text-gray-400 italic md:text-right">
                  {getExperienceTitle(
                    job.startDate,
                    job.endDate,
                    t("pages.about.datePresent")
                  )}
                </p>
              </div>
              <div className="md:w-5/7 md:pl-4">
                <div className="mb-2 flex">
                  <Image
                    alt={job.imageURL}
                    src={builder
                      .image(job.imageURL)
                      .width(companyIconSize)
                      .height(companyIconSize)
                      .url()}
                    width={companyIconSize}
                    height={companyIconSize}
                    className="mt-0 h-fit transition group-hover/item:scale-105"
                  />
                  <div className="pl-3">
                    <Link
                      href={job.link}
                      aria-label={`[Link to] ${job.companyName}`}
                      target="_blank"
                      className="before:absolute before:inset-0 before:block before:h-full before:w-full"
                    >
                      <h3
                        className={`text-lg leading-[18px] font-bold transition group-hover/item:translate-x-1 group-hover/item:italic after:h-5 after:w-5 xl:-ml-[1px] ${getChevronClasses()}`}
                      >
                        {job.companyName.trim()}
                      </h3>
                      <p className="text-base transition group-hover/item:translate-x-1">
                        {job.jobTitle}
                      </p>
                      <p className="text-xs text-gray-400 italic transition group-hover/item:translate-x-1">
                        {job.employmentType}{" "}
                        {job.contractName &&
                          `(${t("pages.about.jobContract")} ${job.contractName})`}
                      </p>
                    </Link>
                  </div>
                </div>
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
    </Layout>
  );
}
