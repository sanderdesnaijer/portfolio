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
      type: "reference",
      to: [{ type: "job" }],
      hidden: ({ parent }) => parent?.employmentType !== "contract",
      options: {
        disableNew: true,
      },
    }),
    defineField({
      name: "logo",
      type: "image",
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
  orderings: [
    {
      title: "Start Date (Newest First)",
      name: "startDateDesc",
      by: [{ field: "startDate", direction: "desc" }],
    },
    {
      title: "Start Date (Oldest First)",
      name: "startDateAsc",
      by: [{ field: "startDate", direction: "asc" }],
    },
  ],
});
