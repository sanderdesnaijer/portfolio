import { DocumentIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const pageType = defineType({
  name: "pages",
  title: "Pages",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({
      name: "name",
      type: "string",
      description:
        "Short label used in the navigation and footer menu. Falls back to Title if empty.",
    }),
    defineField({
      name: "title",
      type: "string",
    }),
    defineField({
      name: "description",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "seoTitleBase",
      title: "SEO title (base)",
      type: "string",
      description:
        "Base text used for the <title> tag. The site brand is appended unless 'Disable brand suffix' is on.",
    }),
    defineField({
      name: "disableBrandTitleSuffix",
      title: "Disable brand suffix",
      type: "boolean",
      description:
        "If on, the SEO title is used as-is without appending ' | <brand>'. Use for titles that already include the brand.",
      initialValue: false,
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "title",
      },
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
      name: "publishedAt",
      type: "datetime",
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Set a custom order for sorting pages",
    }),
    defineField({
      name: "navigationLocation",
      title: "Navigation location",
      type: "string",
      description:
        "Where this page is linked from. 'Main navigation' is the header menu; 'Footer' renders it in the site footer.",
      options: {
        list: [
          { title: "Main navigation", value: "main" },
          { title: "Footer", value: "footer" },
        ],
        layout: "radio",
      },
      initialValue: "main",
    }),
    defineField({
      name: "body",
      type: "blockContent",
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "mainImage",
    },
  },
  orderings: [
    {
      title: "Manual order (bottom)",
      name: "manualOrder",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});
