"use client";

import { PortableText } from "@portabletext/react";
import { client } from "@/sanity/lib/client";
import imageUrlBuilder from "@sanity/image-url";
import Image from "next/image";
import { ProjectTypeSanity } from "@/sanity/types";
import { LinkList } from "./LinkList";
import { convertDate } from "../utils/utils";

const builder = imageUrlBuilder(client);
const imageWidth = 800;
const imageHeight = 400;
const companyIconSize = 24;

export const Project = ({ project }: { project: ProjectTypeSanity }) => {
  return (
    <>
      <p className="-mt-8 mb-0 py-2 text-xs font-light text-gray-700 uppercase dark:dark:text-gray-100">
        {convertDate(project.publishedAt)}
      </p>
      {project?.companyName ? (
        <p className="mt-0 mb-3 flex items-center text-xs italic">
          {`[created at] ${project.companyName}`}{" "}
          <Image
            src={builder
              .image(project.companyLogo!)
              .width(companyIconSize)
              .height(companyIconSize)
              .url()}
            alt={`[created at] ${project.companyName}`}
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
          className="mt-2 mb-0"
        />
      ) : null}

      {project?.body ? <PortableText value={project.body} /> : null}
      {project.links && project.links.length && (
        <LinkList links={project.links} />
      )}
    </>
  );
};

export default Project;
