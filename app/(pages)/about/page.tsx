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

const slug = "about";
const builder = imageUrlBuilder(client);
const mainImageSize = 300;
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
      <h2 className="leading-8 text-sm">{children}</h2>
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

  const t = await getTranslations();

  if (!page) {
    return <PageNotFound />;
  }

  return (
    <main className="container mx-auto pt-20 px-4 prose prose-xl dark:prose-invert">
      <h1 className="font-bold text-8xl mb-10">{page.title}</h1>

      <Image
        alt={page.imageAlt}
        src={builder
          .image(page.imageURL)
          .width(mainImageSize)
          .height(mainImageSize)
          .url()}
        width={mainImageSize}
        height={mainImageSize}
        priority
        className="absolute right-0 top-0"
      />
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
    </main>
  );
}
