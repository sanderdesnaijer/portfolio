"use client";

import { PortableText } from "@portabletext/react";
import { client } from "@/sanity/lib/client";
import imageUrlBuilder from "@sanity/image-url";
import Image from "next/image";
import { ProjectTypeSanity } from "@/sanity/types";
import { getIcon } from "./Icons";

const builder = imageUrlBuilder(client);
const imageSize = 300;

export const Project = ({ project }: { project: ProjectTypeSanity }) => {
  return (
    <>
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
          {project.links.map((link) => {
            const IconComponent = getIcon(link.icon);
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
    </>
  );
};

export default Project;
