type RouteKey = "about" | "blog" | "projects" | "tags";
type Routes = Record<RouteKey, string>;

export const pageSlugs: Routes = {
  about: "about",
  blog: "blog",
  projects: "projects",
  tags: "tags",
};
