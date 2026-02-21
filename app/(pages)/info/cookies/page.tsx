import { Metadata } from "next";
import { PageLayout } from "@/app/components/PageLayout";
import envConfig from "@/envConfig";
import Link from "next/link";
import { AUTHOR_NAME } from "@/app/utils/constants";
import { getTranslations } from "next-intl/server";

const title = "Cookie Policy";
const description =
  "Learn how sanderdesnaijer.com uses cookies to ensure the site works properly and to understand how it is used.";
const url = `${envConfig.baseUrl}/info/cookies`;

export const metadata: Metadata = {
  title,
  description,
  authors: [{ name: AUTHOR_NAME }],
  openGraph: {
    title,
    description,
    type: "website",
    url,
  },
  alternates: {
    canonical: url,
  },
};

export default async function CookiePolicyPage() {
  const t = await getTranslations("cookies");

  return (
    <PageLayout title={t("title")}>
      <article className="prose prose-lg dark:prose-invert mt-10 max-w-none md:mt-20">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          <strong>{t("lastUpdated")}</strong> {t("lastUpdatedDate")}
        </p>

        <p>{t("intro")}</p>

        <h2>{t("whatAreCookies.title")}</h2>
        <p>{t("whatAreCookies.description")}</p>

        <h2>{t("howCookiesAreUsed.title")}</h2>
        <p>{t("howCookiesAreUsed.description")}</p>

        <h3>{t("essentialCookies.title")}</h3>
        <p>{t("essentialCookies.description")}</p>

        <h3>{t("analyticsCookies.title")}</h3>
        <p>{t("analyticsCookies.description")}</p>

        <h2>{t("thirdPartyServices.title")}</h2>
        <p>{t("thirdPartyServices.description")}</p>

        <h2>{t("yourChoices.title")}</h2>
        <p>{t("yourChoices.description")}</p>

        <h2>{t("contact.title")}</h2>
        <p>
          {t("contact.description")}{" "}
          <Link
            href={`mailto:${t("contact.email")}`}
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            {t("contact.email")}
          </Link>
        </p>
      </article>
    </PageLayout>
  );
}
