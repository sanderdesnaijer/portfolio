import { toPlainText } from "next-sanity";
import { ProjectTypeSanity } from "@/sanity/types";
import { ProjectListItem } from "./ProjectListItem";
import { truncateText } from "../utils/utils";
import { useTranslations } from "next-intl";

export const Projects = ({
  projects = [],
  pageSlug,
}: {
  projects: ProjectTypeSanity[];
  pageSlug: string;
}) => {
  const t = useTranslations();

  return (
    <div className="mx-auto md:pt-10">
      <ol
        aria-label={t("pages.project.projects")}
        className="group mt-0 grid gap-10 pl-0"
      >
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
