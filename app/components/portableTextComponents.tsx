"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { PortableTextReactComponents } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";
import { LinkMark } from "./LinkMark";

const YouTube = dynamic(() => import("./YouTube").then((mod) => mod.YouTube), {
  loading: () => (
    <div className="my-6 aspect-video w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
  ),
  ssr: false,
});

const CodeBlock = dynamic(
  () => import("./CodeBlock").then((mod) => mod.CodeBlock),
  {
    loading: () => (
      <div className="my-6 animate-pulse rounded-lg bg-gray-200 p-4 dark:bg-gray-800">
        <div className="h-24" />
      </div>
    ),
    ssr: false,
  }
);

const EmbedBlock = dynamic(
  () => import("./EmbedBlock").then((mod) => mod.EmbedBlock),
  {
    loading: () => (
      <div className="my-6 aspect-video w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
    ),
    ssr: false,
  }
);

interface ImageValue {
  _type: "image";
  asset: {
    _ref: string;
    _type: string;
  };
  alt?: string;
}

interface CodeBlockValue {
  code: string;
  language?: string;
}

interface TableBlockValue {
  caption?: string;
  headers: string[];
  rows: Array<{ _key: string; cells: string[] }>;
}

interface EmbedBlockValue {
  type: "component" | "iframe";
  componentId?: string;
  url?: string;
  caption?: string;
  height?: string;
}

export const portableTextComponents: Partial<PortableTextReactComponents> = {
  types: {
    youTube: ({ value }: { value: { url: string } }) => {
      return <YouTube url={value.url} />;
    },
    image: ({ value }: { value: ImageValue }) => {
      if (!value?.asset) return null;
      const imageUrl = urlFor(value).width(960).format("webp").url();
      return (
        <figure className="my-6">
          <Image
            src={imageUrl}
            alt={value.alt || ""}
            width={960}
            height={540}
            className="rounded-lg"
            sizes="(max-width: 768px) 100vw, 960px"
            loading="lazy"
          />
          {value.alt && (
            <figcaption className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
              {value.alt}
            </figcaption>
          )}
        </figure>
      );
    },
    codeBlock: ({ value }: { value: CodeBlockValue }) => {
      if (!value?.code) return null;
      return <CodeBlock code={value.code} language={value.language} />;
    },
    table: ({ value }: { value: TableBlockValue }) => {
      if (!value?.headers || !value?.rows) return null;
      return (
        <figure className="my-6 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                {value.headers.map((header, i) => (
                  <th
                    key={i}
                    className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-gray-100"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {value.rows.map((row) => (
                <tr
                  key={row._key}
                  className="border-b border-gray-100 dark:border-gray-800"
                >
                  {(row.cells || []).map((cell, i) => (
                    <td
                      key={i}
                      className="px-3 py-2 text-gray-700 dark:text-gray-300"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    embed: ({ value }: { value: EmbedBlockValue }) => {
      return (
        <EmbedBlock
          type={value.type}
          componentId={value.componentId}
          url={value.url}
          caption={value.caption}
          height={value.height}
        />
      );
    },
  },
  marks: {
    code: ({ children }) => (
      <code className="rounded font-mono text-[0.875em]">{children}</code>
    ),
    link: LinkMark,
  },
};
