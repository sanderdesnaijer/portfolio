import { TagSanity } from "@/sanity/types/tagType";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { toTagSlug } from "../utils/utils";

// TODO: move this to sanity schema
// Generic tags that appear on many projects/blogs. When maxTags is set,
// these are deprioritized so more specific tags (MediaPipe, ESP32, etc.) show first.
const GENERIC_TAGS = new Set([
  "javascript",
  "typescript",
  "nextjs",
  "react",
  "css",
  "html",
  "tailwind css",
]);

export function prioritizeTags(tags: TagSanity[]): TagSanity[] {
  const specific: TagSanity[] = [];
  const generic: TagSanity[] = [];
  for (const tag of tags) {
    if (GENERIC_TAGS.has(tag.label.toLowerCase())) {
      generic.push(tag);
    } else {
      specific.push(tag);
    }
  }
  return [...specific, ...generic];
}

interface TagsProps {
  tags: TagSanity[];
  context?: string;
  renderLinks?: boolean;
  maxTags?: number;
}

export const Tags: React.FC<TagsProps> = ({
  tags,
  context,
  renderLinks = true,
  maxTags,
}) => {
  const t = useTranslations();

  if (!tags.length) {
    return null;
  }

  const hasMaxTags = maxTags !== undefined;
  const sortedTags = hasMaxTags ? prioritizeTags(tags) : tags;
  const visibleTags = hasMaxTags ? sortedTags.slice(0, maxTags) : sortedTags;
  const remainingCount = hasMaxTags ? tags.length - visibleTags.length : 0;

  return (
    <ul
      aria-label={t("generic.relatedTags", { context: context || "" })}
      className="mt-4 flex list-none flex-wrap pl-0 text-xs"
    >
      {visibleTags.map((tag) => (
        <li
          className="mt-0 pr-2 pl-0 font-bold text-gray-600 group-hover/item:text-gray-900 dark:text-gray-400 dark:group-hover/item:text-gray-100"
          key={tag._id}
        >
          {renderLinks ? (
            <Link
              className="relative z-10 no-underline hover:underline"
              href={`/tags/${toTagSlug(tag.label)}`}
            >
              {tag.label}
            </Link>
          ) : (
            tag.label
          )}
        </li>
      ))}
      {remainingCount > 0 && (
        <li className="mt-0 pl-0 font-bold text-gray-500 dark:text-gray-400">
          {"+"}
          {remainingCount}
        </li>
      )}
    </ul>
  );
};
