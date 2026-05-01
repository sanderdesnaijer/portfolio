import { IconLink } from "@/sanity/types/types";
import { LinkList } from "./LinkList";

const BlogDate: React.FC<{ date: string; updatedDate?: string }> = ({
  date,
  updatedDate,
}) => (
  <p className="-mt-3.5 mb-2 py-2 text-xs font-bold uppercase md:mt-1.5 dark:dark:text-gray-100">
    {date}
    {updatedDate && (
      <span className="ml-2 font-normal text-gray-500 dark:text-gray-400">
        {`(${updatedDate})`}
      </span>
    )}
  </p>
);

interface ProjectProps {
  children: React.ReactNode;
  date: string;
  updatedDate?: string;
  links?: Array<IconLink>;
}

export const ProjectLayout: React.FC<ProjectProps> = ({
  children,
  date,
  updatedDate,
  links,
}) => (
  <>
    <BlogDate date={date} updatedDate={updatedDate} />
    {children}
    {links?.length ? <LinkList links={links} /> : null}
  </>
);
