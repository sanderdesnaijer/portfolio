import { defineType, defineField, defineArrayMember } from "sanity";

import Github from "../../public/icons/github.svg";
import Article from "../../public/icons/article.svg";
import Download from "../../public/icons/download.svg";
import Demo from "../../public/icons/demo.svg";
import Gitlab from "../../public/icons/gitlab.svg";
import Linkedin from "../../public/icons/linkedin.svg";

const iconSize = 24;
const icons = ["article", "download", "demo", "github", "gitlab", "linkedin"];

const getIcon = (icon: string) => {
  switch (icon) {
    case "article":
      return Article;
    case "download":
      return Download;
    case "demo":
      return Demo;
    case "github":
      return Github;
    case "gitlab":
      return Gitlab;
    case "linkedin":
      return Linkedin;
    default:
      return null;
  }
};

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
