import { Block, YouTubeBlock } from "@/sanity/types/types";

/**
 * Extracts the YouTube video ID from various YouTube URL formats.
 */
export function extractYouTubeVideoId(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace("www.", "");

    if (host === "youtube.com" || host === "m.youtube.com") {
      // /watch?v=ID
      if (parsed.pathname === "/watch") {
        return parsed.searchParams.get("v");
      }
      // /embed/ID
      if (parsed.pathname.startsWith("/embed/")) {
        return parsed.pathname.split("/embed/")[1]?.split("?")[0] || null;
      }
      // /shorts/ID
      if (parsed.pathname.startsWith("/shorts/")) {
        return parsed.pathname.split("/shorts/")[1]?.split("?")[0] || null;
      }
    }

    // youtu.be/ID
    if (host === "youtu.be") {
      return parsed.pathname.slice(1).split("?")[0] || null;
    }
  } catch {
    return null;
  }

  return null;
}

/**
 * Builds the standard YouTube embed URL from a video ID.
 */
export function buildYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}

/**
 * Builds the standard YouTube watch URL from a video ID.
 */
export function buildYouTubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

/**
 * Builds the default YouTube thumbnail URL from a video ID.
 * Uses hqdefault (480x360) for a good balance of quality and size.
 */
export function buildYouTubeThumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

/**
 * Extracts all YouTube blocks from a portable text body.
 */
export function extractYouTubeBlocks(body?: Block[]): YouTubeBlock[] {
  if (!body) return [];
  return body.filter(
    (block): block is YouTubeBlock => block._type === "youTube"
  );
}

export interface VideoInfo {
  url: string;
  videoId: string;
  embedUrl: string;
  thumbnailUrl: string;
}

/**
 * Extracts video info from portable text blocks.
 * Returns an array of VideoInfo objects for each YouTube embed found.
 */
export function extractVideoInfo(body?: Block[]): VideoInfo[] {
  const youtubeBlocks = extractYouTubeBlocks(body);

  return youtubeBlocks
    .map((block) => {
      const videoId = extractYouTubeVideoId(block.url);
      if (!videoId) return null;

      return {
        url: block.url,
        videoId,
        embedUrl: buildYouTubeEmbedUrl(videoId),
        thumbnailUrl: buildYouTubeThumbnailUrl(videoId),
      };
    })
    .filter((info): info is VideoInfo => info !== null);
}
