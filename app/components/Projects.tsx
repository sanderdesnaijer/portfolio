import { toPlainText } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import { ProjectTypeSanity } from "@/sanity/types";
import { convertDate } from "../utils/utils";
import { LinkList } from "./LinkList";

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
    <div className="py-10 mx-auto grid grid-cols-1">
      <div className="grid gap-10">
        {projects.map((project) => {
          const body =
            project?.body && project?.body.length
              ? truncateText(toPlainText(project.body), 200)
              : null;
          return (
            <Link
              className="justify-between hover:opacity-90  no-underline grid grid-cols-5 "
              key={project._id}
              href={`/${pageSlug}/${project.slug.current}`}
            >
              <div className="col-span-2">
                {project?.mainImage && (
                  <Image
                    className="object-fill mt-0"
                    src={project.imageURL}
                    alt={project.mainImage.alt}
                    width={350}
                    height={350}
                    priority
                  />
                )}
              </div>
              <div className="col-span-3 px-4">
                <h2 className="font-normal text-xl text-[2.5rem] mt-0 mb-4">
                  {project.title}
                </h2>
                <p className="py-2 text-gray-700 text-xs font-light uppercase dark:dark:text-gray-100">
                  {convertDate(project._createdAt)}
                </p>

                {body ? (
                  <p className="text-gray-600 dark:text-white text-base">
                    {body}
                  </p>
                ) : null}
                {project.links && project.links.length && (
                  <LinkList links={project.links} />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Projects;
