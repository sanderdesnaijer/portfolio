"use client";

import { PortableText } from "@portabletext/react";
import {
  HeadingIdProvider,
  portableTextComponents,
} from "./portableTextComponents";
import { Block } from "@/sanity/types/types";

interface BlogContentProps {
  value: Block[];
}

export function BlogContent({ value }: BlogContentProps) {
  return (
    <HeadingIdProvider blocks={value}>
      <PortableText
        value={value as Parameters<typeof PortableText>[0]["value"]}
        components={portableTextComponents}
      />
    </HeadingIdProvider>
  );
}
