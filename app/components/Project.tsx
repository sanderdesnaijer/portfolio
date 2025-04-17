"use client";

import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { ProjectTypeSanity } from "@/sanity/types";
import { convertDate } from "../utils/utils";
import { useTranslations } from "next-intl";
import { ProjectLayout } from "./ProjectLayout";
import { urlFor } from "@/sanity/lib/image";

const imageWidth = 860;
const imageHeight = 440;
const companyIconSize = 24;

export const Project = ({ project }: { project: ProjectTypeSanity }) => {
  const t = useTranslations();
  const getCreatedAtTitle = (): string =>
    `${t("pages.about.projectCreatedAt")} ${project.companyName}`;

  return (
    <ProjectLayout
      date={convertDate(project.publishedAt)}
      links={project.links && project.links.length ? project.links : []}
    >
      {project?.mainImage && project.mainImage.alt ? (
        <div className="relative aspect-[43/22] w-full">
          <Image
            src={urlFor(project.mainImage)
              .width(imageWidth)
              .height(imageHeight)
              .url()}
            alt={project.mainImage.alt}
            sizes="(max-width: 768px) 100vw, 860px"
            fill
            priority
            className="mt-0 mb-0 object-cover"
          />
        </div>
      ) : null}
      {project?.companyName ? (
        <p className="mt-4 flex items-center text-xs italic">
          <Image
            src={urlFor(project.companyLogo!)
              .width(companyIconSize)
              .height(companyIconSize)
              .url()}
            alt={getCreatedAtTitle()}
            width={companyIconSize}
            height={companyIconSize}
            className="mt-0 mr-2 mb-0"
            loading="lazy"
          />
          {getCreatedAtTitle()}
        </p>
      ) : null}

      {project?.body ? <PortableText value={project.body} /> : null}
    </ProjectLayout>
  );
};

export default Project;
