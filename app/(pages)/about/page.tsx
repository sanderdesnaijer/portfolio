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
      <h2 className="font-extralight text-4xl w-2/3 mb-10">{children}</h2>
    ),
    span: ({ children }: { children?: React.ReactNode }) => (
      <span className="font-extralight text-4xl w-2/3 mb-10 block">
        {children}
      </span>
    ),
  },
};

const jobComponents: Partial<PortableTextReactComponents> = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="leading-8 text-sm mb-3">{children}</p>
    ),
  },
};

const getExperienceTitle = (
  startDate: string,
  endDate: string | undefined,
  presentTitle: string
): string => {
  const start = convertDate(startDate, false);
  const end = endDate ? convertDate(endDate, false) : presentTitle;
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
      rightColSlot={
        <div className="-mt-8 -ml-8 p-2 bg-white dark:bg-black border-b-black border-b-1 border-black dark:border-white absolute z-10  after:content-[''] after:absolute after:top-[168px] after:bottom-0 after:left-0 after:border-l after:border-black dark:after:border-white before:content-[''] before:absolute before:top-[168px] before:bottom-0 before:right-0 before:border-r before:border-black dark:before:border-white">
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
      }
    >
      {page?.body ? (
        <PortableText value={page.body} components={components} />
      ) : null}

      <h2>{t("job-experience")}</h2>
      <ol className="list-none p-0 flex flex-col gap-10 not-prose">
        {jobs?.map((job) => {
          return (
            <li key={job._id} className="flex">
              <div className="w-1/5">
                <p className="text-base text-right mt-0 mb-2">
                  {getExperienceTitle(
                    job.startDate,
                    job.endDate,
                    t("date-present")
                  )}
                </p>
              </div>
              <div className="w-4/5 pl-4">
                <div className="flex mb-2">
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
                  <div className="pl-2">
                    <Link
                      href={job.link}
                      aria-label={`[Link to] ${job.companyName}`}
                      target="_blank"
                    >
                      <h3 className="text-lg font-bold">{job.companyName}</h3>
                      <p className="text-base">{job.jobTitle}</p>
                    </Link>
                  </div>
                </div>
                <PortableText
                  value={job.description}
                  components={jobComponents}
                />

                <p className="text-sm">{job.tags}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </Layout>
  );
}
