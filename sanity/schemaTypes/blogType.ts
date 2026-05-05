import { defineField, defineType } from "sanity";

export const blogType = defineType({
  name: "blogPost",
  title: "Blog Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) =>
        Rule.required()
          .max(46)
          .warning(
            "Title + ' | Sander de Snaijer' should stay under 65 chars total"
          ),
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "mainImage",
      title: "Featured Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
        },
      ],
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      description: "Short summary for listings and SEO (max 160 characters)",
      validation: (Rule) =>
        Rule.max(160).warning("Excerpt should be under 160 characters for SEO"),
    }),
    defineField({
      name: "body",
      title: "Content",
      type: "blockContent",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
      validation: (rule) =>
        rule.unique().error("Each tag can only be added once."),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
    }),
    defineField({
      name: "links",
      title: "Links",
      type: "link",
      validation: (Rule) =>
        Rule.custom((value: unknown) => {
          if (!value) return true;
          if (!Array.isArray(value)) {
            return "Links must be a list of link items.";
          }
          const links = value as Array<Record<string, unknown>>;
          for (const link of links) {
            if (!link.title) return "Link title is required.";
            if (!link.link) return "Link URL is required.";
            if (!link.icon) return "Link icon is required.";
          }
          return true;
        }),
    }),
    defineField({
      name: "faq",
      title: "FAQ",
      type: "faq",
      description:
        "Frequently asked questions shown at the bottom of the post and used for FAQ schema markup",
    }),
    defineField({
      name: "mediumUrl",
      title: "Medium URL (legacy)",
      type: "url",
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "mainImage",
      subtitle: "publishedAt",
    },
  },
});
