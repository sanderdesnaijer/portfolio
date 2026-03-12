import { getTranslations } from "next-intl/server";
import { NotFound } from "@/app/components/NotFound";
import { pageSlugs } from "@/app/utils/routes";
import { buildPageUrl } from "@/app/utils/utils";

export async function generateMetadata() {
  const t = await getTranslations();

  return {
    title: t("error.404.blog.title"),
    description: t("error.404.blog.description"),
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function BlogNotFound() {
  const t = await getTranslations();

  return (
    <NotFound
      title={t("error.404.blog.title")}
      description={t("error.404.blog.description")}
      href={buildPageUrl(pageSlugs.blog)}
      action={t("error.404.blog.action")}
    />
  );
}
