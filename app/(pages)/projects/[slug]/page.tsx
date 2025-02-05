import { QueryParams } from "@sanity/client";
import { projectQuery, settingsQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/fetch";
import { ProjectTypeSanity, SettingSanity } from "@/sanity/types";
import { PageNotFound } from "@/app/components/PageNotFound";
import { Layout } from "@/app/components/Layout";
import Project from "@/app/components/Project";

export const revalidate = 60;

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
    <Layout title={project.title} socialMedia={setting.socialMedia}>
      <Project project={project} />
    </Layout>
  );
};

export default ProductPage;
