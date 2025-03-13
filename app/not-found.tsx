"use server";
import { getTranslations } from "next-intl/server";
import { AUTHOR_NAME } from "./utils/constants";
import { CustomLink } from "./components/CustomLink";
import { getBaseUrl } from "./utils/routes";

export async function generateMetadata() {
  const t = await getTranslations();

  return {
    title: `${AUTHOR_NAME} | ${t("error.404.generic.title")}`,
    description: t("error.404.generic.description"),
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function Page() {
  const t = await getTranslations();

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="mb-2 w-full text-center text-2xl font-bold">
        {t("error.404.generic.title")}
      </h1>
      <CustomLink
        title={t("error.404.generic.action")}
        href={getBaseUrl()}
        target="_self"
        className={"inline-block text-center"}
      />
    </div>
  );
}
