import { ControlsIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

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
    defineField({
      name: "socialMedia",
      type: "link",
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
  },
});
