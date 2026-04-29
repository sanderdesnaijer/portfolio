"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { ComponentType } from "react";

const embedRegistry: Record<string, ComponentType> = {
  faceMeshChart: dynamic(() => import("./embeds/FaceMeshLandmarkChart"), {
    loading: () => (
      <div className="my-6 h-[400px] w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
    ),
    ssr: false,
  }),
};

interface EmbedBlockProps {
  type: "component" | "iframe";
  componentId?: string;
  url?: string;
  caption?: string;
  height?: string;
}

export function EmbedBlock({
  type,
  componentId,
  url,
  caption,
  height,
}: EmbedBlockProps) {
  const t = useTranslations();

  if (type === "iframe" && url) {
    return (
      <figure className="not-prose my-8">
        <div
          className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
          style={{ height: height || "80vh", minHeight: 400 }}
        >
          <iframe
            src={url}
            title={caption || t("embed.interactiveDemo")}
            className="h-full w-full border-0"
            allow="camera"
            loading="lazy"
          />
        </div>
        {caption && (
          <figcaption className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  }

  if (type === "component" && componentId) {
    const Component = embedRegistry[componentId];

    if (!Component) {
      if (process.env.NODE_ENV === "development") {
        return (
          <div className="my-6 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
            {t("embed.unknownComponent")} <code>{componentId}</code>
          </div>
        );
      }
      return null;
    }

    return (
      <figure className="not-prose my-8">
        <div
          className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
          style={height ? { height } : undefined}
        >
          <Component />
        </div>
        {caption && (
          <figcaption className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  }

  return null;
}
