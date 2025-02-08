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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "jobTitle",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "employmentType",
      title: "Employment Type",
      type: "string",
      options: {
        list: [
          { title: "Full-Time", value: "full-time" },
          { title: "Intern", value: "intern" },
          { title: "Contract", value: "contract" },
        ],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "contractName",
      title: "Contract Name",
      type: "string",
      hidden: ({ parent }) => parent?.employmentType !== "contract",
    }),
    defineField({
      name: "logo",
      type: "image",
      options: {
        hotspot: true,
      },
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
      name: "description",
      type: "blockContent",
    }),
    defineField({
      name: "tags",
      type: "string",
    }),
    defineField({
      name: "link",
      type: "url",
      title: "Link",
      validation: (Rule) => Rule.uri({ allowRelative: false }).required(),
    }),
  ],
  preview: {
    select: {
      title: "companyName",
      media: "logo",
    },
  },
});
