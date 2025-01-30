import { toPlainText } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import { ProjectTypeSanity } from "@/sanity/types";
import { convertDate } from "../utils/utils";

export const truncateText = (text: string, length: number) => {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
};

export const Projects = ({
  projects = [],
}: {
  projects: ProjectTypeSanity[];
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
              className="items-center justify-between hover:opacity-90"
              key={project._id}
              href={project.slug.current}
            >
              <h2 className="font-medium text-xl">{project.title}</h2>
              <p className="py-2 text-gray-400 text-xs font-light uppercase">
                {convertDate(project._createdAt)}
              </p>
              {project?.mainImage && (
                <Image
                  className="w-32 object-fill rounded-lg"
                  src={project.imageURL}
                  alt={project.mainImage.alt}
                  width={350}
                  height={350}
                  priority
                />
              )}
              {body ? <p className="text-gray-600 text-sm">{body}</p> : null}
              {project.links && project.links.length && (
                <ul>
                  {project.links.map(async (link) => {
                    const IconComponent = (
                      await import(`../../public/icons/${link.icon}.svg`)
                    ).default;

                    return (
                      <li
                        key={link.title}
                        aria-label={`${link.icon} icon`}
                        title={link.icon}
                      >
                        <IconComponent />
                        <h3>{link.title}</h3>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Projects;
