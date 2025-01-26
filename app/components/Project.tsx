"use client";

import { PortableText } from "@portabletext/react";
import { client } from "@/sanity/lib/client";
import imageUrlBuilder from "@sanity/image-url";
import Image from "next/image";
import { ICON_SIZE } from "../utils/constants";
import { ProjectTypeSanity } from "@/sanity/lib/types";

const builder = imageUrlBuilder(client);
const imageSize = 300;

export const Project = ({ project }: { project: ProjectTypeSanity }) => {
  return (
    <main className="container mx-auto prose prose-xl px-4 py-16">
      <h1>{project.title}</h1>
      <p>{project.description}</p>
      {project?.mainImage && project.mainImage.alt ? (
        <Image
          src={builder
            .image(project.mainImage)
            .width(imageSize)
            .height(imageSize)
            .url()}
          alt={project.mainImage.alt}
          width={imageSize}
          height={imageSize}
          priority
        />
      ) : null}
      {project?.body ? <PortableText value={project.body} /> : null}
      {project.links && project.links.length && (
        <ul>
          {project.links.map((link) => (
            <li key={link.title}>
              <Image
                aria-hidden
                src={`/icons/${link.icon}.svg`}
                alt={`${link.icon} icon`}
                width={ICON_SIZE}
                height={ICON_SIZE}
              />
              <p>{link.title}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default Project;
