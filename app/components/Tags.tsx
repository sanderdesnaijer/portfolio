import { TagSanity } from "@/sanity/types/tagType";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { toTagSlug } from "../utils/utils";

interface TagsProps {
  tags: TagSanity[];
  context?: string;
  renderLinks?: boolean;
}

export const Tags: React.FC<TagsProps> = ({
  tags,
  context,
  renderLinks = true,
}) => {
  const t = useTranslations();

  if (!tags.length) {
    return null;
  }

  return (
    <ul
      aria-label={t("generic.relatedTags", { context: context || "" })}
      className="0 mt-4 flex list-none flex-wrap pl-0 text-xs"
    >
      {tags.map((tag) => (
        <li
          className="mt-0 pr-2 pl-0 font-bold text-gray-600 group-hover/item:text-gray-900 dark:text-gray-400 dark:group-hover/item:text-gray-100"
          key={tag._id}
        >
          {renderLinks ? (
            <Link
              className="no-underline hover:underline"
              href={`/tags/${toTagSlug(tag.label)}`}
            >
              {tag.label}
            </Link>
          ) : (
            tag.label
          )}
        </li>
      ))}
    </ul>
  );
};
