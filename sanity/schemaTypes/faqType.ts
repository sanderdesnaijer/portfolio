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
          title: "Answer",
          type: "array",
          validation: (Rule) => Rule.required(),
          of: [
            defineArrayMember({
              type: "block",
              styles: [{ title: "Normal", value: "normal" }],
              lists: [{ title: "Bullet", value: "bullet" }],
              marks: {
                decorators: [
                  { title: "Strong", value: "strong" },
                  { title: "Code", value: "code" },
                ],
                annotations: [
                  {
                    title: "URL",
                    name: "link",
                    type: "object",
                    fields: [
                      {
                        title: "URL",
                        name: "href",
                        type: "url",
                        validation: (Rule) => Rule.uri({ allowRelative: true }),
                      },
                    ],
                  },
                ],
              },
            }),
          ],
        }),
      ],
      preview: {
        select: {
          title: "question",
        },
      },
    }),
  ],
});
