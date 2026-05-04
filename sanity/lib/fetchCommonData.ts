import { sanityFetch } from "@/sanity/lib/fetch";
import { allPagesQuery, settingsQuery } from "@/sanity/lib/queries";
import { PageSanity, SettingSanity } from "@/sanity/types";
import { MenuItem } from "@/app/components/Menu";

export async function fetchCommonData() {
  const setting = await sanityFetch<SettingSanity>({ query: settingsQuery });
  const pages = await sanityFetch<PageSanity[]>({ query: allPagesQuery })
    .then((res) => {
      return res || [];
    })
    .catch(() => {
      // console.log(error);
      return [];
    });
  const toMenuItem = ({
    title,
    slug,
  }: Pick<PageSanity, "title" | "slug">): MenuItem => ({
    title,
    pathname: `/${slug && slug.current ? slug.current : ""}`,
  });

  const menuItems = pages
    .filter((page) => (page.navigationLocation ?? "main") === "main")
    .map(toMenuItem);

  const footerItems = pages
    .filter((page) => page.navigationLocation === "footer")
    .map(toMenuItem);

  return { setting, menuItems, footerItems };
}
