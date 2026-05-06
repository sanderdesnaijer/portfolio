import { getTranslations } from "next-intl/server";
import { NotFound } from "@/app/components/NotFound";
import { pageSlugs } from "@/app/utils/routes";
import { buildPageUrl } from "@/app/utils/utils";

export async function generateMetadata() {
  const t = await getTranslations();

  return {
    title: t("error.404.tag.title"),
    description: t("error.404.tag.description"),
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function TagNotFound() {
  const t = await getTranslations();

  return (
    <NotFound
      title={t("error.404.tag.title")}
      description={t("error.404.tag.description")}
      href={buildPageUrl(pageSlugs.tags)}
      action={t("error.404.tag.action")}
    />
  );
}
