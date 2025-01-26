"use client";

import { PortableText } from "@portabletext/react";
import { client } from "@/sanity/lib/client";
import imageUrlBuilder from "@sanity/image-url";
import Image from "next/image";
import { ICON_SIZE } from "../utils/constants";
import { PostTypeSanity } from "@/sanity/lib/types";

const builder = imageUrlBuilder(client);
const imageSize = 300;

export const Post = ({ post }: { post: PostTypeSanity }) => {
  return (
    <main className="container mx-auto prose prose-xl px-4 py-16">
      <h1>{post.title}</h1>
      <p>{post.description}</p>
      {post?.mainImage && post.mainImage.alt ? (
        <Image
          src={builder
            .image(post.mainImage)
            .width(imageSize)
            .height(imageSize)
            .url()}
          alt={post.mainImage.alt}
          width={imageSize}
          height={imageSize}
          priority
        />
      ) : null}
      {post?.body ? <PortableText value={post.body} /> : null}
      {post.links && post.links.length && (
        <ul>
          {post.links.map((link) => (
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

export default Post;
