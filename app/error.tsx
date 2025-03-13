"use client";

import { useTranslations } from "next-intl";

export const Page: React.FC<{ error: Error }> = ({ error }) => {
  const t = useTranslations();

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="mb-2 w-full text-center text-2xl font-bold">
        {t("error.generic.title")}
      </h1>
      <p>
        <span className="font-bold">{`${error.name}: `}</span>
        {error.message}
      </p>
    </div>
  );
};

export default Page;
