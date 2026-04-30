"use client";

import {
  extractYouTubeVideoId,
  buildYouTubeThumbnailUrl,
  buildYouTubeWatchUrl,
} from "@/app/utils/videoUtils";
import { useTranslations } from "next-intl";

interface YouTubeFallbackProps {
  url: string;
}

/**
 * Server-rendered YouTube fallback that displays a clickable thumbnail.
 * This ensures crawlers (and users without JS) see video content on the page,
 * which strengthens the "watch page" signal for Google Video indexing.
 *
 * Hidden when the client-side ReactPlayer loads via the `has-js` class.
 */
export function YouTubeFallback({ url }: YouTubeFallbackProps) {
  const t = useTranslations();
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) return null;

  const thumbnailUrl = buildYouTubeThumbnailUrl(videoId);
  const watchUrl = buildYouTubeWatchUrl(videoId);
  const ariaLabel = t("video.watchOnYouTube");

  return (
    <noscript>
      <div className="relative my-6 aspect-video w-full overflow-hidden rounded-lg">
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={ariaLabel}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnailUrl}
            alt="Video thumbnail"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            loading="lazy"
          />
        </a>
      </div>
    </noscript>
  );
}
