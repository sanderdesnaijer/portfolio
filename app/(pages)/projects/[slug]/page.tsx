"use server";
import { QueryParams } from "@sanity/client";
import { projectQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/fetch";
import { ProjectTypeSanity } from "@/sanity/types";
import { PageNotFound } from "@/app/components/PageNotFound";
import { Layout } from "@/app/components/Layout";
import Project from "@/app/components/Project";
import { Tags } from "@/app/components/Tags";
import { generatePageMetadata } from "@/app/utils/metadata";
import { fetchCommonData } from "@/sanity/lib/fetchCommonData";
import { REVALIDATE_INTERVAL } from "@/app/utils/constants";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const project = await sanityFetch<ProjectTypeSanity>({
    query: projectQuery,
    params,
  });

  return {
    ...generatePageMetadata({ pageSlug: "projects", project }),
    revalidate: REVALIDATE_INTERVAL,
  };
}

const ProductPage = async ({ params }: { params: Promise<QueryParams> }) => {
  const project = await sanityFetch<ProjectTypeSanity>({
    query: projectQuery,
    params,
  });
  const { setting, menuItems } = await fetchCommonData();

  if (!project) {
    return <PageNotFound />;
  }

  return (
    <Layout
      pageTitle={project.title}
      socialMedia={setting.socialMedia}
      authorName={setting.title}
      menuItems={menuItems}
    >
      <Project project={project} />
      {project.tags && <Tags tags={project.tags} />}
    </Layout>
  );
};

export default ProductPage;
