import { IconLink } from "@/sanity/types/types";
import { LinkList } from "./LinkList";

const BlogDate: React.FC<{ date: string }> = ({ date }) => (
  <p className="-mt-3.5 mb-2 py-2 text-xs font-bold uppercase md:mt-1.5 dark:dark:text-gray-100">
    {date}
  </p>
);

interface ProjectProps {
  children: React.ReactNode;
  date: string;
  links?: Array<IconLink>;
}

export const ProjectLayout: React.FC<ProjectProps> = ({
  children,
  date,
  links,
}) => (
  <>
    <BlogDate date={date} />
    {children}
    {links ? <LinkList links={links} /> : null}
  </>
);
