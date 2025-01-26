import { DocumentTextIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const jobType = defineType({
  name: "job",
  title: "Job",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "companyName",
      type: "string",
    }),
    defineField({
      name: "jobTitle",
      type: "string",
    }),
    defineField({
      name: "logo",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "description",
      type: "blockContent",
    }),
    defineField({
      name: "startDate",
      type: "datetime",
    }),
    defineField({
      name: "endDate",
      type: "datetime",
    }),
    defineField({
      name: "tags",
      type: "string",
    }),
    defineField({
      name: "links",
      type: "link",
    }),
  ],
  preview: {
    select: {
      title: "companyName",
      media: "logo",
    },
  },
});
