import { defineType, defineField, defineArrayMember } from "sanity";

export const faqType = defineType({
  name: "faq",
  type: "array",
  title: "FAQ",
  of: [
    defineArrayMember({
      type: "object",
      fields: [
        defineField({
          name: "question",
          type: "string",
          title: "Question",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "answer",
          type: "text",
          title: "Answer",
          rows: 4,
          validation: (Rule) => Rule.required(),
        }),
      ],
      preview: {
        select: {
          title: "question",
          subtitle: "answer",
        },
      },
    }),
  ],
});
