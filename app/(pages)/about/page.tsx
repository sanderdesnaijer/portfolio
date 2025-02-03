import { sanityFetch } from "@/sanity/lib/fetch";
import { jobsQuery, pageQuery } from "@/sanity/lib/queries";
import { PortableText } from "next-sanity";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/sanity/lib/client";
import { JobSanity, PageSanity } from "@/sanity/types";
import { convertDate } from "@/app/utils/utils";
import { PageNotFound } from "@/app/components/PageNotFound";
import { getIcon } from "@/app/components/Icons";
import { getTranslations } from "next-intl/server";

const slug = "about";

const builder = imageUrlBuilder(client);

const imageSize = 300;
const companyIconSize = 48;

const DefaultParagraphComponent = ({
  children,
}: {
  children?: React.ReactNode;
}) => <p className="text-lg leading-8">{children}</p>;

const components = {
  block: {
    normal: DefaultParagraphComponent,
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

const jobComponents = {
  block: {
    normal: DefaultParagraphComponent,
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
          .width(imageSize)
          .height(imageSize)
          .url()}
        width={imageSize}
        height={imageSize}
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
                    <h3 className="text-lg font-bold">{job.companyName}</h3>
                    <p className="text-base">{job.jobTitle}</p>
                  </div>
                </div>
                <PortableText
                  value={job.description}
                  components={jobComponents}
                />
                {job.links && job.links.length && (
                  <ol>
                    {job.links.map((link) => {
                      const IconComponent = getIcon(link.icon);
                      return (
                        <li
                          key={link.title}
                          aria-label={`${link.icon} icon`}
                          title={link.icon}
                          className="flex"
                        >
                          {IconComponent && <IconComponent />}
                          <div>{link.title}</div>
                        </li>
                      );
                    })}
                  </ol>
                )}
                <p>{job.tags}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </main>
  );
}
