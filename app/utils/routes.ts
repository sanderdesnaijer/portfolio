type RouteKey = "about" | "blog" | "projects";
type Routes = Record<RouteKey, string>;

export const getBaseUrl = (): string => {
  if (!process.env.NEXT_PUBLIC_BASE_URL) {
    throw new Error(
      "NEXT_PUBLIC_BASE_URL is not set in the environment variables."
    );
  }
  return process.env.NEXT_PUBLIC_BASE_URL;
};

export const pageSlugs: Routes = {
  about: "about",
  blog: "blog",
  projects: "projects",
};
