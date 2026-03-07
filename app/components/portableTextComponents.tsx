"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { PortableTextReactComponents } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";

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

interface ImageValue {
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
  },
  marks: {
    code: ({ children }) => (
      <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[0.875em] dark:bg-gray-800">
        {children}
      </code>
    ),
  },
};
