import { QueryParams } from "@sanity/client";
import { projectPathsQuery, projectQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/fetch";
import { client } from "@/sanity/lib/client";
import { Project } from "../../components/Project";
import { ProjectTypeSanity } from "@/sanity/types";
import { PageNotFound } from "@/app/components/PageNotFound";
import { Layout } from "@/app/components/Layout";

export const revalidate = 60;

export async function generateStaticParams() {
  const projects = await client.fetch(projectPathsQuery);
  return projects;
}

const ProductPage = async ({ params }: { params: QueryParams }) => {
  const project = await sanityFetch<ProjectTypeSanity>({
    query: projectQuery,
    params,
  });

  if (!project) {
    return <PageNotFound />;
  }

  return (
    <Layout title={project.title}>
      <Project project={project} />
    </Layout>
  );
};

export default ProductPage;
