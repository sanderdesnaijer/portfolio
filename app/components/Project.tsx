"use client";

import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { ProjectTypeSanity } from "@/sanity/types";
import { convertDate } from "../utils/utils";
import { useTranslations } from "next-intl";
import { ProjectLayout } from "./ProjectLayout";
import { urlFor } from "@/sanity/lib/image";

const imageWidth = 800;
const imageHeight = 400;
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
      {project?.companyName ? (
        <p className="mt-0 mb-3 flex items-center text-xs italic">
          {getCreatedAtTitle()}
          <Image
            src={urlFor(project.companyLogo!)
              .width(companyIconSize)
              .height(companyIconSize)
              .url()}
            alt={getCreatedAtTitle()}
            width={companyIconSize}
            height={companyIconSize}
            priority
            className="mt-0 mb-0! ml-2"
          />
        </p>
      ) : null}
      {project?.mainImage && project.mainImage.alt ? (
        <Image
          src={urlFor(project.mainImage)
            .width(imageWidth)
            .height(imageHeight)
            .url()}
          alt={project.mainImage.alt}
          width={imageWidth}
          height={imageHeight}
          priority
          className="mt-0 mb-0"
        />
      ) : null}

      {project?.body ? <PortableText value={project.body} /> : null}
    </ProjectLayout>
  );
};

export default Project;
