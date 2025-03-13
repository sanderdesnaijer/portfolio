import { useTranslations } from "next-intl";

export const PageNotFound = () => {
  const t = useTranslations();

  return (
    <div className="flex h-screen items-center">
      <p className="w-full text-center">{t("error.404.generic.title")}</p>
    </div>
  );
};
