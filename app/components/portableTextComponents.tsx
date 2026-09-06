"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { createContext, useContext, useMemo } from "react";
import { PortableTextReactComponents } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";
import { LinkMark } from "./LinkMark";
import { YouTubeFallback } from "./YouTubeFallback";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type HeadingBlock = {
  _key?: string;
  style?: string;
  children?: { text?: string }[];
};

// Maps each heading block's stable _key to its anchor id. The map is built once
// per document so the server and the client derive identical ids. Deduplicating
// through a module-level counter instead would keep incrementing across renders
// and client navigations, which breaks hydration and the anchor links with it.
const HeadingIdContext = createContext<Map<string, string> | null>(null);

function buildHeadingIds(blocks: unknown): Map<string, string> {
  const ids = new Map<string, string>();
  if (!Array.isArray(blocks)) return ids;

  const used = new Set<string>();
  for (const block of blocks as HeadingBlock[]) {
    if (!block?._key || !block.style || !/^h[2-4]$/.test(block.style)) continue;

    const base = slugify(
      (block.children ?? []).map((c) => c?.text ?? "").join("")
    );
    let id = base;
    let counter = 1;
    while (used.has(id)) {
      id = `${base}-${counter}`;
      counter++;
    }
    used.add(id);
    ids.set(block._key, id);
  }
  return ids;
}

export function HeadingIdProvider({
  blocks,
  children,
}: {
  blocks: unknown;
  children: React.ReactNode;
}) {
  const ids = useMemo(() => buildHeadingIds(blocks), [blocks]);
  return (
    <HeadingIdContext.Provider value={ids}>
      {children}
    </HeadingIdContext.Provider>
  );
}

function HeadingWithAnchor({
  children,
  level,
  blockKey,
}: {
  children?: React.ReactNode;
  level: 2 | 3 | 4;
  blockKey?: string;
}) {
  const text =
    typeof children === "string"
      ? children
      : Array.isArray(children)
        ? children
            .map((child) =>
              typeof child === "string" ? child : (child?.props?.children ?? "")
            )
            .join("")
        : "";
  const headingIds = useContext(HeadingIdContext);
  const id = (blockKey && headingIds?.get(blockKey)) || slugify(text);
  const Tag = `h${level}` as const;

  return (
    <Tag id={id} className="group scroll-mt-24">
      {children}
      <a
        href={`#${id}`}
        className="ml-2 text-gray-300 no-underline opacity-0 transition-opacity group-hover:opacity-100 hover:text-gray-500 focus-visible:opacity-100 dark:text-gray-600 dark:hover:text-gray-400"
        aria-label={`Link to ${text}`}
      >
        {"#"}
      </a>
    </Tag>
  );
}

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
      return (
        <>
          <YouTube url={value.url} />
          <YouTubeFallback url={value.url} />
        </>
      );
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
  block: {
    h2: ({ children, value }) => (
      <HeadingWithAnchor level={2} blockKey={value?._key}>
        {children}
      </HeadingWithAnchor>
    ),
    h3: ({ children, value }) => (
      <HeadingWithAnchor level={3} blockKey={value?._key}>
        {children}
      </HeadingWithAnchor>
    ),
    h4: ({ children, value }) => (
      <HeadingWithAnchor level={4} blockKey={value?._key}>
        {children}
      </HeadingWithAnchor>
    ),
  },
  marks: {
    code: ({ children }) => (
      <code className="rounded font-mono text-[0.875em]">{children}</code>
    ),
    link: LinkMark,
  },
};
