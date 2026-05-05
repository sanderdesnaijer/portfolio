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
    name,
    title,
    slug,
  }: Pick<PageSanity, "name" | "title" | "slug">): MenuItem => {
    const label = (name?.trim() || title) ?? "";
    return {
      title: label.charAt(0).toUpperCase() + label.slice(1),
      pathname: `/${slug && slug.current ? slug.current : ""}`,
    };
  };

  const menuItems = pages
    .filter((page) => (page.navigationLocation ?? "main") === "main")
    .map(toMenuItem);

  const footerItems = pages
    .filter((page) => page.navigationLocation === "footer")
    .map(toMenuItem);

  return { setting, menuItems, footerItems };
}
