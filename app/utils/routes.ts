type RouteKey = "about" | "blog" | "projects";
type Routes = Record<RouteKey, string>;

// TODO: https://github.com/sanderdesnaijer/portfolio/issues/120 move to env util together with all process.env
export const getBaseUrl = (): string => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!baseUrl) {
    throw new Error(
      "NEXT_PUBLIC_BASE_URL is not set in the environment variables."
    );
  }
  return baseUrl;
};

export const pageSlugs: Routes = {
  about: "about",
  blog: "blog",
  projects: "projects",
};
