"use client";

import dynamic from "next/dynamic";
import { PortableTextReactComponents } from "@portabletext/react";

// Lazy-load the YouTube component to reduce bundle size for pages without videos
const YouTube = dynamic(() => import("./YouTube").then((mod) => mod.YouTube), {
  loading: () => (
    <div className="my-6 aspect-video w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
  ),
  ssr: false,
});

/**
 * Shared PortableText components configuration for rendering custom blocks
 * like YouTube embeds across the application.
 */
export const portableTextComponents: Partial<PortableTextReactComponents> = {
  types: {
    youTube: ({ value }: { value: { url: string } }) => {
      return <YouTube url={value.url} />;
    },
  },
};
