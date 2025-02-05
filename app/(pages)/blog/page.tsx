import { Layout } from "@/app/components/Layout";
import { PageNotFound } from "@/app/components/PageNotFound";
import { sanityFetch } from "@/sanity/lib/fetch";
import { pageQuery, settingsQuery } from "@/sanity/lib/queries";
import { PageSanity, SettingSanity } from "@/sanity/types";

const slug = "blog";

export default async function Page() {
  const page = await sanityFetch<PageSanity>({
    query: pageQuery,
    params: { slug: slug },
  });
  const setting = await sanityFetch<SettingSanity>({ query: settingsQuery });

  if (!page) {
    return <PageNotFound />;
  }

  return <Layout title={page.title} socialMedia={setting.socialMedia} />;
}
