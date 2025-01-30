import { getIcon, icons, iconSize } from "@/app/components/Icons";
import { defineType, defineField, defineArrayMember } from "sanity";

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
              ? () => {
                  const IconComponent = getIcon(icon);
                  return (
                    <span
                      style={{
                        width: iconSize,
                        height: iconSize,
                      }}
                      aria-label={icon}
                    >
                      <IconComponent data-sanity-icon />
                    </span>
                  );
                }
              : null,
          };
        },
      },
    }),
  ],
});
