"use server";
import { CustomLink } from "./components/LinkList";
import { getTranslations } from "next-intl/server";
import { AUTHOR_NAME } from "./utils/constants";

export async function generateMetadata() {
  const t = await getTranslations();

  return {
    title: `${AUTHOR_NAME} | ${t("error.404.title")}`,
    description: t("error.404.description"),
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
        {t("page-not-found")}
      </h1>
      <CustomLink
        title={t("error.404.action")}
        href={process.env.NEXT_PUBLIC_BASE_URL || "/"}
        target="_self"
        className={"inline-block text-center"}
      />
    </div>
  );
}
