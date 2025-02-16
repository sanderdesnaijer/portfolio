import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const tagType = defineType({
  name: "tag",
  title: "Tag",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "label",
      type: "string",
    }),
  ],
  preview: {
    select: {
      title: "label",
    },
  },
});
