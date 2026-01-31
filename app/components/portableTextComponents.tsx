"use client";

import { PortableTextReactComponents } from "@portabletext/react";
import { YouTube } from "./YouTube";

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
