import { sanityFetch } from "@/sanity/lib/fetch";
import { jobsQuery, pageQuery } from "@/sanity/lib/queries";
import { PortableText } from "next-sanity";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/sanity/lib/client";
import { JobSanity, PageSanity } from "@/sanity/types";
import { convertDate } from "@/app/utils/utils";
import { ICON_SIZE } from "@/app/utils/constants";
import { PageNotFound } from "@/app/components/PageNotFound";

const slug = "about-me";

const builder = imageUrlBuilder(client);

const imageSize = 300;
const companyIconSize = 50;

export default async function Page() {
  const page = await sanityFetch<PageSanity>({
    query: pageQuery,
    params: { slug: slug },
  });

  const jobs = await sanityFetch<JobSanity[]>({
    query: jobsQuery,
  });

  if (!page) {
    return <PageNotFound />;
  }

  return (
    <main className="container mx-auto prose prose-xl px-4 py-16">
      <h1>{page.title}</h1>

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
      />
      {page?.body ? <PortableText value={page.body} /> : null}

      <h3>[Experience]</h3>
      <ol>
        {jobs?.map((job) => {
          return (
            <li key={job._id}>
              <Image
                alt={job.imageURL}
                src={builder
                  .image(job.imageURL)
                  .width(companyIconSize)
                  .height(companyIconSize)
                  .url()}
                width={companyIconSize}
                height={companyIconSize}
              />
              <h3>{job.companyName}</h3>
              <p>{job.jobTitle}</p>
              <p className="">
                {convertDate(job.startDate, false)} -{" "}
                {job.endDate ? convertDate(job.endDate, false) : "[present]"}
              </p>

              <PortableText value={job.description} />
              {job.links && job.links.length && (
                <ul>
                  {job.links.map((link) => (
                    <li key={link.title}>
                      <Image
                        aria-hidden
                        src={`/icons/${link.icon}.svg`}
                        alt={`${link.icon} icon`}
                        width={ICON_SIZE}
                        height={ICON_SIZE}
                      />
                      <h3>{link.title}</h3>
                    </li>
                  ))}
                </ul>
              )}
              <p>{job.tags}</p>
            </li>
          );
        })}
      </ol>
    </main>
  );
}
