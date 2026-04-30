import {
  extractYouTubeVideoId,
  buildYouTubeEmbedUrl,
  buildYouTubeWatchUrl,
  buildYouTubeThumbnailUrl,
  extractYouTubeBlocks,
  extractVideoInfo,
} from "./videoUtils";
import { Block, YouTubeBlock } from "@/sanity/types/types";

describe("utils/videoUtils", () => {
  describe("extractYouTubeVideoId", () => {
    it("should extract ID from standard watch URL", () => {
      expect(
        extractYouTubeVideoId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
      ).toBe("dQw4w9WgXcQ");
    });

    it("should extract ID from short URL", () => {
      expect(extractYouTubeVideoId("https://youtu.be/dQw4w9WgXcQ")).toBe(
        "dQw4w9WgXcQ"
      );
    });

    it("should extract ID from embed URL", () => {
      expect(
        extractYouTubeVideoId("https://www.youtube.com/embed/dQw4w9WgXcQ")
      ).toBe("dQw4w9WgXcQ");
    });

    it("should extract ID from shorts URL", () => {
      expect(
        extractYouTubeVideoId("https://www.youtube.com/shorts/dQw4w9WgXcQ")
      ).toBe("dQw4w9WgXcQ");
    });

    it("should extract ID from mobile URL", () => {
      expect(
        extractYouTubeVideoId("https://m.youtube.com/watch?v=dQw4w9WgXcQ")
      ).toBe("dQw4w9WgXcQ");
    });

    it("should extract ID from URL with extra params", () => {
      expect(
        extractYouTubeVideoId(
          "https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=120"
        )
      ).toBe("dQw4w9WgXcQ");
    });

    it("should return null for invalid URL", () => {
      expect(extractYouTubeVideoId("not-a-url")).toBeNull();
    });

    it("should return null for non-YouTube URL", () => {
      expect(extractYouTubeVideoId("https://vimeo.com/12345")).toBeNull();
    });
  });

  describe("buildYouTubeEmbedUrl", () => {
    it("should build correct embed URL", () => {
      expect(buildYouTubeEmbedUrl("dQw4w9WgXcQ")).toBe(
        "https://www.youtube.com/embed/dQw4w9WgXcQ"
      );
    });
  });

  describe("buildYouTubeWatchUrl", () => {
    it("should build correct watch URL", () => {
      expect(buildYouTubeWatchUrl("dQw4w9WgXcQ")).toBe(
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
      );
    });
  });

  describe("buildYouTubeThumbnailUrl", () => {
    it("should build correct thumbnail URL", () => {
      expect(buildYouTubeThumbnailUrl("dQw4w9WgXcQ")).toBe(
        "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg"
      );
    });
  });

  describe("extractYouTubeBlocks", () => {
    it("should extract YouTube blocks from mixed content", () => {
      const body: Block[] = [
        {
          _type: "block",
          _key: "1",
          children: [{ _type: "span", text: "Hello", marks: [] }],
          style: "normal",
        },
        {
          _type: "youTube",
          _key: "2",
          url: "https://www.youtube.com/watch?v=abc123",
        } as YouTubeBlock,
        {
          _type: "image",
          _key: "3",
          asset: { _ref: "ref", _type: "reference" },
        },
      ];

      const result = extractYouTubeBlocks(body);
      expect(result).toHaveLength(1);
      expect(result[0].url).toBe("https://www.youtube.com/watch?v=abc123");
    });

    it("should return empty array when no YouTube blocks exist", () => {
      const body: Block[] = [
        {
          _type: "block",
          _key: "1",
          children: [{ _type: "span", text: "Hello", marks: [] }],
          style: "normal",
        },
      ];

      expect(extractYouTubeBlocks(body)).toEqual([]);
    });

    it("should return empty array for undefined body", () => {
      expect(extractYouTubeBlocks(undefined)).toEqual([]);
    });
  });

  describe("extractVideoInfo", () => {
    it("should extract video info from blocks with YouTube embeds", () => {
      const body: Block[] = [
        {
          _type: "youTube",
          _key: "1",
          url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        } as YouTubeBlock,
      ];

      const result = extractVideoInfo(body);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        videoId: "dQw4w9WgXcQ",
        embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
      });
    });

    it("should skip blocks with invalid YouTube URLs", () => {
      const body: Block[] = [
        {
          _type: "youTube",
          _key: "1",
          url: "https://vimeo.com/12345",
        } as unknown as YouTubeBlock,
      ];

      expect(extractVideoInfo(body)).toEqual([]);
    });

    it("should return empty array for undefined body", () => {
      expect(extractVideoInfo(undefined)).toEqual([]);
    });
  });
});
