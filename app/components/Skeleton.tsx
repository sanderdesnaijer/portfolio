import { AUTHOR_NAME } from "../utils/constants";
import { Layout } from "./Layout";

export const OverviewSkeleton = ({ count = 6 }) => (
  <div className="mx-auto md:pt-10">
    <ol className="group mt-0 grid gap-10 pl-0">
      {Array.from({ length: count }).map((_, index) => (
        <li
          key={index}
          className="group/item relative mt-0 mb-0 grid grid-cols-5 justify-between pl-0 no-underline transition-opacity duration-200"
        >
          <div className="col-span-1 md:col-span-2">
            <div className="mt-0 mb-0 h-12 w-[100%] animate-pulse rounded-md bg-gray-200 object-fill md:h-40"></div>
          </div>
          <div className="col-span-4 px-4 md:col-span-3">
            <div className="my-2 mt-0 h-12 w-full animate-pulse rounded bg-gray-200"></div>
            <div className="my-2 h-6 w-3/4 animate-pulse rounded bg-gray-200"></div>
            <div className="my-2 h-4 w-1/2 animate-pulse rounded bg-gray-200"></div>
            <div className="mt-2 h-4 w-full animate-pulse rounded bg-gray-200"></div>
            <div className="mt-2 flex">
              <div className="mr-2 h-4 w-20 animate-pulse rounded bg-gray-200"></div>
              <div className="mr-2 h-4 w-20 animate-pulse rounded bg-gray-200"></div>
              <div className="mr-2 h-4 w-20 animate-pulse rounded bg-gray-200"></div>
              <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
            </div>
          </div>
        </li>
      ))}
    </ol>
  </div>
);

export const Skeleton = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => (
  <Layout
    pageTitle={title}
    socialMedia={[]}
    menuItems={[
      { title: "Home", pathname: "/" },
      { title: "About", pathname: "/about" },
      { title: "Projects", pathname: "/projects" },
      { title: "Blog", pathname: "/blog" },
    ]}
    authorName={AUTHOR_NAME}
  >
    {children}
  </Layout>
);
