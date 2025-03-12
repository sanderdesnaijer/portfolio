import { useTranslations } from "next-intl";
import { LinkList } from "./components/LinkList";

export default function Page() {
  const t = useTranslations();
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="w-full text-center text-2xl">{t("page-not-found")}</h1>
      {/** TODO: dont send into new tab with _blank  */}
      <LinkList
        links={[
          {
            title: t("back-to-home"),
            link: process.env.NEXT_PUBLIC_BASE_URL || "/",
            icon: "demo",
          },
        ]}
      ></LinkList>
    </div>
  );
}
