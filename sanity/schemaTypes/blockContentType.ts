import { defineType, defineArrayMember } from "sanity";
import { ImageIcon, PlayIcon, CodeBlockIcon } from "@sanity/icons";

export const blockContentType = defineType({
  title: "Block Content",
  name: "blockContent",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H1", value: "h1" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
        { title: "H4", value: "h4" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Number", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
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
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: "image",
      icon: ImageIcon,
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
        },
      ],
    }),
    defineArrayMember({
      type: "youTube",
      icon: PlayIcon,
    }),
    defineArrayMember({
      name: "codeBlock",
      title: "Code Block",
      type: "object",
      icon: CodeBlockIcon,
      fields: [
        {
          name: "code",
          title: "Code",
          type: "text",
        },
        {
          name: "language",
          title: "Language",
          type: "string",
          options: {
            list: [
              { title: "JavaScript", value: "javascript" },
              { title: "TypeScript", value: "typescript" },
              { title: "HTML", value: "html" },
              { title: "CSS", value: "css" },
              { title: "JSON", value: "json" },
              { title: "Bash", value: "bash" },
              { title: "Python", value: "python" },
              { title: "Dart", value: "dart" },
              { title: "YAML", value: "yaml" },
              { title: "Plain Text", value: "text" },
            ],
          },
        },
      ],
      preview: {
        select: { code: "code", language: "language" },
        prepare({ code, language }) {
          return {
            title: language || "Code",
            subtitle: code ? code.substring(0, 80) : "",
          };
        },
      },
    }),
  ],
});
