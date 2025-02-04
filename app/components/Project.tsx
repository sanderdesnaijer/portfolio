"use client";

import { PortableText } from "@portabletext/react";
import { client } from "@/sanity/lib/client";
import imageUrlBuilder from "@sanity/image-url";
import Image from "next/image";
import { ProjectTypeSanity } from "@/sanity/types";
import { LinkList } from "./LinkList";

const builder = imageUrlBuilder(client);
const imageWidth = 800;
const imageHeight = 400;

export const Project = ({ project }: { project: ProjectTypeSanity }) => {
  return (
    <>
      <p>{project.description}</p>
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
