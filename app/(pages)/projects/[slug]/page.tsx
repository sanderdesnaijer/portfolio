import { QueryParams } from "@sanity/client";
import { projectQuery, settingsQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/fetch";
import { ProjectTypeSanity, SettingSanity } from "@/sanity/types";
import { PageNotFound } from "@/app/components/PageNotFound";
import { Layout } from "@/app/components/Layout";
import Project from "@/app/components/Project";
import { Tags } from "@/app/components/Tags";
import { generatePageMetadata } from "@/app/utils/metadata";

export const revalidate = 600;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const project = await sanityFetch<ProjectTypeSanity>({
    query: projectQuery,
    params,
  });
  return generatePageMetadata({ pageSlug: "projects", project });
}

const ProductPage = async ({ params }: { params: QueryParams }) => {
  const project = await sanityFetch<ProjectTypeSanity>({
    query: projectQuery,
    params,
  });
  const setting = await sanityFetch<SettingSanity>({ query: settingsQuery });

  if (!project) {
    return <PageNotFound />;
  }

  return (
    <Layout
      pageTitle={project.title}
      socialMedia={setting.socialMedia}
      authorName={setting.title}
    >
      <Project project={project} />
      {project.tags && <Tags tags={project.tags} />}
    </Layout>
  );
};

export default ProductPage;
