import { sanityFetch } from "@/sanity/lib/fetch";
import { pageQuery } from "@/sanity/lib/queries";
import { PageSanity, ProjectTypeSanity } from "@/sanity/types";
import { toPlainText } from "next-sanity";
import { truncateText } from "./utils";

export async function generatePageMetadata({
  pageSlug,
  project,
}: {
  pageSlug: string;
  project?: ProjectTypeSanity;
}) {
  const page = await sanityFetch<PageSanity>({
    query: pageQuery,
    params: { slug: pageSlug },
  });
  const baseTitle = `Sander de Snaijer | ${page.title}`;
  const title = project ? `${baseTitle} | ${project.title}` : baseTitle;

  const description = project?.body
    ? truncateText(toPlainText(project?.body), 160)
    : page.description;

  return {
    title,
    description,
  };
}
