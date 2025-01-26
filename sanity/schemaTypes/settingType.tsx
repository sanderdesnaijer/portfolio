import { ControlsIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import Image from "next/image";

const iconSize = 30;
const socialMediaIcons = ["github", "gitlab", "linkedin"];

export const settingType = defineType({
  name: "setting",
  title: "Setting",
  type: "document",
  icon: ControlsIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
    }),
    defineField({
      name: "description",
      type: "string",
    }),
    defineField({
      name: "socialMedia",
      type: "array",
      title: "Social Media",
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
                list: socialMediaIcons.map((icon) => ({
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
    },
  },
});
