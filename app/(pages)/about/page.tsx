import { sanityFetch } from "@/sanity/lib/fetch";
import { jobsQuery, pageQuery, settingsQuery } from "@/sanity/lib/queries";
import { PortableText, PortableTextReactComponents } from "next-sanity";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/sanity/lib/client";
import { JobSanity, PageSanity, SettingSanity } from "@/sanity/types";
import { convertDate } from "@/app/utils/utils";
import { PageNotFound } from "@/app/components/PageNotFound";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Layout } from "@/app/components/Layout";
import { Tags } from "@/app/components/Tags";

export const revalidate = 1;

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
      <span className="mb-10 block w-2/3 text-lg font-extralight sm:text-4xl">
        {children}
      </span>
    ),
  },
};

const jobComponents: Partial<PortableTextReactComponents> = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-3 text-sm leading-8">{children}</p>
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

export default async function Page() {
  const page = await sanityFetch<PageSanity>({
    query: pageQuery,
    params: { slug: slug },
  });

  const jobs = await sanityFetch<JobSanity[]>({
    query: jobsQuery,
  });
  const setting = await sanityFetch<SettingSanity>({ query: settingsQuery });

  const t = await getTranslations();

  if (!page) {
    return <PageNotFound />;
  }

  return (
    <Layout
      pageTitle={page.title}
      socialMedia={setting.socialMedia}
      authorName={setting.title}
    >
      <div className="not-prose absolute -top-[169px] -right-[100px] z-10 mt-[60px] mr-[100px] w-[120px] border-b-1 border-black border-b-black bg-white p-2 before:absolute before:top-[109px] before:right-0 before:bottom-0 before:border-r before:border-black before:content-[''] after:absolute after:top-[109px] after:bottom-0 after:left-0 after:border-l after:border-black after:content-[''] sm:mt-auto sm:mr-auto sm:w-auto sm:before:top-[168px] sm:after:top-[168px] dark:border-white dark:bg-black dark:before:border-white dark:after:border-white">
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

      <h2>{t("job-experience")}</h2>
      <ol className="not-prose flex list-none flex-col gap-10 p-0">
        {jobs?.map((job) => {
          return (
            <li key={job._id} className="flex">
              <div className="w-1/5">
                <p className="mt-0 mb-2 text-right text-base">
                  {getExperienceTitle(
                    job.startDate,
                    job.endDate,
                    t("date-present")
                  )}
                </p>
              </div>
              <div className="w-4/5 pl-4">
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
                    className="mt-0 h-fit"
                  />
                  <div className="pl-3">
                    <Link
                      href={job.link}
                      aria-label={`[Link to] ${job.companyName}`}
                      target="_blank"
                    >
                      <h3 className="text-lg leading-[18px] font-bold">
                        {job.companyName}
                      </h3>
                      <p className="text-base">{job.jobTitle}</p>
                      <p className="text-xs italic">
                        {job.employmentType}{" "}
                        {job.contractName &&
                          `(${t("job-contract")} ${job.contractName})`}
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
