import { defineType, defineField, type PreviewProps } from "sanity";
import { PlayIcon } from "@sanity/icons";
import { Flex, Text } from "@sanity/ui";
import ReactPlayer from "react-player";

function YouTubePreview(props: PreviewProps) {
  const { title: url } = props;

  return (
    <Flex padding={3} align="center" justify="center">
      {typeof url === "string" ? (
        <ReactPlayer src={url} />
      ) : (
        <Text>{"Add a YouTube URL"}</Text>
      )}
    </Flex>
  );
}

export const youTubeType = defineType({
  name: "youTube",
  type: "object",
  title: "YouTube Embed",
  icon: PlayIcon,
  fields: [
    defineField({
      name: "url",
      type: "url",
      title: "YouTube video URL",
      description:
        "Paste a YouTube URL (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)",
    }),
  ],
  preview: {
    select: { title: "url" },
  },
  components: {
    preview: YouTubePreview,
  },
});
