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
  const menuItems = pages.map<MenuItem>(({ title, slug }) => ({
    title,
    pathname: `/${slug && slug.current ? slug.current : ""}`,
  }));

  return { setting, menuItems };
}
