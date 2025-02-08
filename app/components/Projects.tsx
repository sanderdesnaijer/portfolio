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
    <div className="mx-auto grid grid-cols-1 py-10">
      <div className="grid gap-10">
        {projects.map((project) => {
          const body =
            project?.body && project?.body.length
              ? truncateText(toPlainText(project.body), 200)
              : null;
          return (
            <div
              className="relative grid grid-cols-5 justify-between no-underline hover:opacity-90"
              key={project._id}
            >
              <div className="col-span-2">
                {project?.mainImage && (
                  <Image
                    className="mt-0 object-fill"
                    src={project.imageURL}
                    alt={project.mainImage.alt}
                    width={350}
                    height={350}
                    priority
                  />
                )}
              </div>
              <div className="col-span-3 px-4">
                <Link
                  href={`/${pageSlug}/${project.slug.current}`}
                  className="no-underline before:absolute before:right-0 before:left-0 before:h-full before:opacity-0"
                >
                  {/* <span className="absolute right-0 left-0 h-full opacity-0"></span> */}
                  <h2 className="-mt-3 mb-2 text-xl text-[2.5rem] font-normal">
                    {project.title}
                  </h2>
                </Link>
                <p className="mb-2 py-2 text-xs font-light text-gray-700 uppercase dark:dark:text-gray-100">
                  {convertDate(project._createdAt)}
                </p>

                {body ? (
                  <p className="mt-0 text-base text-gray-600 dark:text-white">
                    {body}
                  </p>
                ) : null}
                {project.links && project.links.length && (
                  <LinkList links={project.links} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Projects;
