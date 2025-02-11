"use client";

import { PortableText } from "@portabletext/react";
import { client } from "@/sanity/lib/client";
import imageUrlBuilder from "@sanity/image-url";
import Image from "next/image";
import { ProjectTypeSanity } from "@/sanity/types";
import { convertDate } from "../utils/utils";
import { useTranslations } from "next-intl";
import { ProjectLayout } from "./ProjectLayout";

const builder = imageUrlBuilder(client);
const imageWidth = 800;
const imageHeight = 400;
const companyIconSize = 24;

export const Project = ({ project }: { project: ProjectTypeSanity }) => {
  const t = useTranslations();
  const getCreatedAtTitle = (): string =>
    `${t("project-created-at")} ${project.companyName}`;

  return (
    <ProjectLayout
      date={convertDate(project.publishedAt)}
      links={project.links && project.links.length ? project.links : []}
    >
      {project?.companyName ? (
        <p className="mt-0 mb-3 flex items-center text-xs italic">
          {getCreatedAtTitle()}
          <Image
            src={builder
              .image(project.companyLogo!)
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
          src={builder
            .image(project.mainImage)
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
