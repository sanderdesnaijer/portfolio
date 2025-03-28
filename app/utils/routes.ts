type RouteKey = "about" | "blog" | "projects";
type Routes = Record<RouteKey, string>;

export const pageSlugs: Routes = {
  about: "about",
  blog: "blog",
  projects: "projects",
};
