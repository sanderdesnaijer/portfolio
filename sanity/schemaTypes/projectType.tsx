import { DocumentTextIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const projectType = defineType({
  name: "project",
  title: "Project",
  type: "document",
  icon: DocumentTextIcon,
  fieldsets: [
    {
      name: "jsonLd",
      title: "JSON-LD Settings",
      options: { collapsible: true, collapsed: false },
    },
  ],
  fields: [
    defineField({
      name: "title",
      type: "string",
    }),
    defineField({
      name: "slug",
      type: "slug",
      validation: (Rule) => Rule.required(),
      options: {
        source: "title",
      },
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
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
    // JSON-LD
    defineField({
      name: "jsonLdType",
      title: "JSON-LD Type",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required().min(1),
      options: {
        list: [
          { title: "Software Application", value: "SoftwareApplication" },
          { title: "CreativeWork", value: "CreativeWork" },
          { title: "Software Source Code", value: "SoftwareSourceCode" },
          { title: "Web Application", value: "WebApplication" },
        ],
        layout: "list",
      },
      fieldset: "jsonLd",
    }),
    // SoftwareApplication
    defineField({
      name: "jsonLdApplicationCategory",
      title: "JSON-LD Application Category",
      type: "string",
      options: {
        list: [
          { title: "Game", value: "Game" },
          { title: "WeatherApp", value: "WeatherApp" },
          { title: "WebApp", value: "WebApp" },
          { title: "MobileApplication", value: "MobileApplication" },
          { title: "Business", value: "Business" },
        ],
      },
      hidden: ({ parent }) => {
        const jsonLdType = parent?.jsonLdType;
        return (
          jsonLdType &&
          !(
            jsonLdType.includes("SoftwareApplication") ||
            jsonLdType.includes("MobileApplication") ||
            jsonLdType.includes("WebApplication")
          )
        );
      },
      fieldset: "jsonLd",
    }),

    defineField({
      name: "jsonLdOperatingSystem",
      title: "JSON-LD Operating System",
      type: "string",
      placeholder: "iOS",
      hidden: ({ parent }) =>
        !parent?.jsonLdType?.includes("SoftwareApplication"),
      fieldset: "jsonLd",
    }),
    // SoftwareSourceCode
    defineField({
      name: "jsonLdCodeRepository",
      title: "JSON-LD Code repository",
      type: "string",
      placeholder: "",
      hidden: ({ parent }) =>
        !parent?.jsonLdType?.includes("SoftwareSourceCode"),
      fieldset: "jsonLd",
    }),
    defineField({
      name: "jsonLdProgrammingLanguage",
      title: "JSON-LD Programming language",
      type: "string",
      placeholder: "",
      hidden: ({ parent }) =>
        !parent?.jsonLdType?.includes("SoftwareSourceCode"),
      fieldset: "jsonLd",
    }),
    // other meta
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
      type: "link",
    }),
    defineField({
      name: "job",
      title: "Job name",
      type: "reference",
      to: [{ type: "job" }],
      options: {
        disableNew: true,
      },
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "mainImage",
    },
  },
  orderings: [
    {
      title: "Publish Date (Newest First)",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
    {
      title: "Publish Date (Oldest First)",
      name: "publishedAtAsc",
      by: [{ field: "publishedAt", direction: "asc" }],
    },
  ],
});
