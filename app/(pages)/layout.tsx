import { fetchCommonData } from "@/sanity/lib/fetchCommonData";
import React from "react";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { getTranslations } from "next-intl/server";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [{ setting, menuItems }, t] = await Promise.all([
    fetchCommonData(),
    getTranslations("cookies"),
  ]);

  return (
    <div className="mx-auto grid grid-cols-9 pt-0 md:container">
      <Header menuItems={menuItems} />
      <main className="prose prose-xl dark:prose-invert relative col-span-9 max-w-fit px-6 pb-6 md:col-span-6 md:px-0 md:pt-6 md:pb-0 lg:col-span-5">
        <div className="flex min-h-full flex-col">{children}</div>
      </main>
      <Footer
        socialMedia={setting.socialMedia}
        cookiePolicyLabel={t("title")}
      />
    </div>
  );
}
