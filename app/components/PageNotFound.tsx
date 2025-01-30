import { useTranslations } from "next-intl";

export const PageNotFound = () => {
  const t = useTranslations();

  return (
    <div>
      <p>{t("page-not-found")}</p>
    </div>
  );
};
