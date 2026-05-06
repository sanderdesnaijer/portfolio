import { getTranslations } from "next-intl/server";
import { NotFound } from "@/app/components/NotFound";

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
      href="/tags"
      action={t("error.404.tag.action")}
    />
  );
}
