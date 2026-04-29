import { defineType, defineArrayMember } from "sanity";
import {
  ImageIcon,
  PlayIcon,
  CodeBlockIcon,
  ComponentIcon,
  ThListIcon,
} from "@sanity/icons";

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
    defineArrayMember({
      name: "table",
      title: "Table",
      type: "object",
      icon: ThListIcon,
      fields: [
        {
          name: "caption",
          title: "Caption",
          type: "string",
          description: "Optional caption shown below the table",
        },
        {
          name: "headers",
          title: "Column Headers",
          type: "array",
          of: [{ type: "string" }],
          validation: (rule) => rule.required().min(2),
        },
        {
          name: "rows",
          title: "Rows",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                {
                  name: "cells",
                  title: "Cells",
                  type: "array",
                  of: [{ type: "string" }],
                },
              ],
              preview: {
                select: { cells: "cells" },
                prepare({ cells }: { cells?: string[] }) {
                  return {
                    title: cells?.join(" | ") || "Empty row",
                  };
                },
              },
            },
          ],
        },
      ],
      preview: {
        select: { caption: "caption", headers: "headers", rows: "rows" },
        prepare({
          caption,
          headers,
          rows,
        }: {
          caption?: string;
          headers?: string[];
          rows?: unknown[];
        }) {
          return {
            title: caption || headers?.join(" | ") || "Table",
            subtitle: `${rows?.length || 0} rows, ${headers?.length || 0} columns`,
          };
        },
      },
    }),
    defineArrayMember({
      name: "embed",
      title: "Interactive Embed",
      type: "object",
      icon: ComponentIcon,
      fields: [
        {
          name: "type",
          title: "Embed Type",
          type: "string",
          options: {
            list: [
              { title: "Inline Component", value: "component" },
              { title: "Iframe (external URL)", value: "iframe" },
            ],
            layout: "radio",
          },
          initialValue: "component",
          validation: (rule) => rule.required(),
        },
        {
          name: "componentId",
          title: "Component ID",
          type: "string",
          description:
            "Identifier for the React component (e.g. faceMeshChart)",
          hidden: ({ parent }: { parent: { type?: string } }) =>
            parent?.type !== "component",
        },
        {
          name: "url",
          title: "URL",
          type: "url",
          description:
            "URL to embed (e.g. https://demos.sanderdesnaijer.com/face-mesh-explorer)",
          hidden: ({ parent }: { parent: { type?: string } }) =>
            parent?.type !== "iframe",
        },
        {
          name: "caption",
          title: "Caption",
          type: "string",
        },
        {
          name: "height",
          title: "Height",
          type: "string",
          description: "CSS height value (e.g. 600px, 80vh). Defaults to auto.",
        },
      ],
      preview: {
        select: {
          type: "type",
          componentId: "componentId",
          url: "url",
          caption: "caption",
        },
        prepare({
          type,
          componentId,
          url,
          caption,
        }: {
          type?: string;
          componentId?: string;
          url?: string;
          caption?: string;
        }) {
          const source =
            type === "iframe" ? url || "no URL" : componentId || "no component";
          return {
            title: caption || source,
            subtitle: `${type === "iframe" ? "Iframe" : "Component"}: ${source}`,
          };
        },
      },
    }),
  ],
});
