"use client";

import ReactPlayer from "react-player";

interface YouTubeProps {
  url: string;
}

/**
 * Detects if a YouTube URL is a Shorts video
 * Shorts URLs typically contain /shorts/ in the path
 */
function isYouTubeShort(url: string): boolean {
  return url.includes("/shorts/");
}

export function YouTube({ url }: YouTubeProps) {
  if (!url) {
    return null;
  }

  const isShort = isYouTubeShort(url);

  // Shorts are 9:16 aspect ratio, regular videos are 16:9
  // For shorts, we use a max-width to prevent them from being too wide
  if (isShort) {
    return (
      <div className="my-6 flex justify-center">
        <div className="relative aspect-[9/16] w-full max-w-[360px] overflow-hidden rounded-lg">
          <ReactPlayer
            src={url}
            width="100%"
            height="100%"
            className="absolute top-0 left-0"
            controls
          />
        </div>
      </div>
    );
  }

  // Regular landscape video (16:9)
  return (
    <div className="relative my-6 aspect-video w-full overflow-hidden rounded-lg">
      <ReactPlayer
        src={url}
        width="100%"
        height="100%"
        className="absolute top-0 left-0"
        controls
      />
    </div>
  );
}
