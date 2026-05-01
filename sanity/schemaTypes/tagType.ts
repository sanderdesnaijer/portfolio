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
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "label",
        isUnique: async (slug, context) => {
          const { document, getClient } = context;
          const client = getClient({ apiVersion: "2025-01-24" });
          const id = document?._id.replace(/^drafts\./, "");
          const count = await client.fetch<number>(
            `count(*[_type == "tag" && slug.current == $slug && !(_id in [$id, $draftId])])`,
            { slug, id, draftId: `drafts.${id}` }
          );
          return count === 0;
        },
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      rows: 3,
      description:
        "SEO description for the tag page (shown in search results). Aim for 150-160 characters.",
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "text",
      rows: 3,
      description:
        "Short intro paragraph displayed at the top of the tag page.",
    }),
  ],
  preview: {
    select: {
      title: "label",
      subtitle: "slug.current",
    },
  },
});
