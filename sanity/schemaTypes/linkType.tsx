import { defineType, defineField, defineArrayMember } from "sanity";
import Image from "next/image";

const iconSize = 24;
const icons = ["article", "download", "demo", "github", "gitlab", "linkedin"];

export const linkType = defineType({
  name: "link",
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
              : null,
          };
        },
      },
    }),
  ],
});
