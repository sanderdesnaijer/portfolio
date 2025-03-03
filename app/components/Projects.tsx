import { toPlainText } from "next-sanity";
import { ProjectTypeSanity } from "@/sanity/types";
import { ProjectListItem } from "./ProjectListItem";

export const truncateText = (text: string, length: number) => {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
};

export const Projects = ({
  projects = [],
  pageSlug,
}: {
  projects: ProjectTypeSanity[];
  pageSlug: string;
}) => {
  return (
    <div className="mx-auto grid grid-cols-1 md:py-10">
      <ol className="group mt-0 grid gap-10 pl-0">
        {projects.map((project) => {
          const body =
            project?.body && project?.body.length
              ? truncateText(toPlainText(project.body), 200)
              : null;

          return (
            <ProjectListItem
              key={project._id}
              href={`/${pageSlug}/${project.slug.current}`}
              date={project.publishedAt}
              imageURL={project.imageURL}
              imageALT={project.mainImage?.alt}
              title={project.title}
              tags={project.tags}
              body={body}
            />
          );
        })}
      </ol>
    </div>
  );
};

export default Projects;
