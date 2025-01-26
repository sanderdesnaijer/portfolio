import { DocumentTextIcon, UserIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

import Image from "next/image";

const iconSize = 30;
const icons = ["article", "download", "demo", "github"];

export const postType = defineType({
  name: "post",
  title: "Post",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "title",
      },
    }),
    defineField({
      name: "mainImage",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alternative text",
        }),
      ],
    }),
    // defineField({
    //   name: "categories",
    //   type: "array",
    //   of: [defineArrayMember({ type: "reference", to: { type: "category" } })],
    // }),
    defineField({
      name: "publishedAt",
      type: "datetime",
    }),
    defineField({
      name: "body",
      type: "blockContent",
    }),
    defineField({
      name: "links",
      type: "array",
      title: "Links",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "title",
              type: "string",
              title: "Title",
            }),
            defineField({
              name: "link",
              type: "url",
              title: "Link",
              validation: (Rule) => Rule.uri({ allowRelative: false }),
            }),
            defineField({
              name: "icon",
              type: "string",
              title: "Icon",
              options: {
                list: icons.map((icon) => ({
                  title: icon,
                  value: icon,
                })),
              },
            }),
          ],
          preview: {
            select: {
              title: "title",
              icon: "icon",
              media: "icon",
            },
            prepare: ({ title, icon }) => {
              const iconUrl = icon ? `/icons/${icon}.svg` : null;

              return {
                title: title || "No title provided",
                media: iconUrl
                  ? () => (
                      <Image
                        key={icon}
                        aria-hidden
                        src={`/icons/${icon}.svg`}
                        alt={title}
                        width={iconSize}
                        height={iconSize}
                      />
                    )
                  : UserIcon,
              };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "mainImage",
    },
  },
});
